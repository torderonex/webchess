package handler

import (
	"encoding/json"
	"github.com/torderonex/webchess/server/entities"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	"github.com/torderonex/webchess/server/pkg/utils"
)

var (
	wsupgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	clients = struct {
		sync.RWMutex
		data map[string][]*websocket.Conn
	}{
		data: make(map[string][]*websocket.Conn),
	}
)

func (h *Handler) observe(c *gin.Context) {
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Println(err)
		return
	}

	id := c.Param("id")
	clients.Lock()
	clients.data[id] = append(clients.data[id], conn)
	clients.Unlock()

	for {
		t, msg, err := conn.ReadMessage()
		if err != nil {
			clients.Lock()
			clients.data[id] = utils.RemoveByValue(clients.data[id], conn)
			delete(clients.data, id) // Optionally, remove the key if it's empty.
			clients.Unlock()

			err = conn.Close()
			// newErrorResponse(c, websocket.CloseMessageTooBig, "read message error")
			break
		}

		id, err := strconv.Atoi(id)

		var parsed struct {
			Option string `json:"option"`
			Msg    string `json:"msg"`
		}

		err = json.Unmarshal(msg, &parsed)
		if err != nil {
		}
		if parsed.Option == "board_state" {
			err = h.service.Game.SetBoardState(id, parsed.Msg)
			if err != nil {
			}
		} else if parsed.Option == "player_pick" {
			var dto entities.JoinDto
			err = json.Unmarshal([]byte(parsed.Msg), &dto)
			if err != nil {
				log.Println(err)
			}
			err = h.service.Game.Join(dto)
			if err != nil {
				log.Println(err)
			}
		} else if parsed.Option == "current_player" {
			err = h.service.Game.SetCurrentPlayer(id, parsed.Msg)
			if err != nil {
				log.Println(err)
			}
		}

		clients.RLock()
		for _, co := range clients.data[c.Param("id")] {
			err = co.WriteMessage(t, msg)
			if err != nil {
				clients.RUnlock()

				clients.Lock()
				clients.data[c.Param("id")] = utils.RemoveByValue(clients.data[c.Param("id")], conn)
				delete(clients.data, c.Param("id")) // Optionally, remove the key if it's empty.
				clients.Unlock()

				err = conn.Close()
				// newErrorResponse(c, websocket.CloseMessageTooBig, "write message error")
				break
			}
		}
		clients.RUnlock()
	}
}
