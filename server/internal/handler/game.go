package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/torderonex/webchess/server/entities"
	"net/http"
	"strconv"
)

func (h *Handler) create(c *gin.Context) {
	dto := struct {
		HostID int `json:"host_id"`
	}{}
	if err := c.BindJSON(&dto); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	lobbyID, err := h.service.Game.CreateLobby(dto.HostID)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"lobby_id": lobbyID,
	})
}

func (h *Handler) delete(c *gin.Context) {
	dto := struct {
		LobbyID int `json:"lobby_id"`
	}{}
	if err := c.BindJSON(&dto); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.service.Game.DeleteLobby(dto.LobbyID); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
}

func (h *Handler) finishGame(c *gin.Context) {
	dto := struct {
		LobbyID  int    `json:"lobby_id"`
		Cause    string `json:"cause"`
		WinnerID int    `json:"winner_id"`
	}{}
	if err := c.BindJSON(&dto); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.service.Game.FinishGame(dto.LobbyID, dto.Cause, dto.WinnerID); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *Handler) join(c *gin.Context) {
	dto := entities.JoinDto{}
	if err := c.BindJSON(&dto); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.service.Game.Join(dto); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *Handler) getGameInfo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	gameInfo, err := h.service.Game.GetGameInfo(id)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gameInfo)
}
