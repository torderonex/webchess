package handler

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/service"
	"net/http"
	"strconv"
)

func (h *Handler) register(c *gin.Context) {
	var user entities.Player
	if err := c.BindJSON(&user); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	token, id, err := h.service.Authorization.CreateUser(user)
	if err != nil {
		if errors.Is(err, service.ValidationError) {
			newErrorResponse(c, http.StatusUnprocessableEntity, err.Error())
		} else if errors.Is(err, service.UserAlreadyExistError) {
			newErrorResponse(c, http.StatusConflict, err.Error())
		} else {
			newErrorResponse(c, http.StatusInternalServerError, err.Error())
		}
		return
	}
	c.JSON(200, map[string]interface{}{
		"tokens":    token,
		"player_id": id,
	})
}

func (h *Handler) login(c *gin.Context) {
	var user entities.Player
	if err := c.BindJSON(&user); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	dto, err := h.service.Authorization.Login(user)
	if err != nil {
		if errors.Is(err, service.UserDoesntExistError) {
			newErrorResponse(c, http.StatusNotFound, err.Error())
		} else if errors.Is(err, service.EmailIsNotActivatedError) {
			newErrorResponse(c, http.StatusUnauthorized, err.Error())
		}
		return
	}
	c.SetCookie("refreshToken", dto.Tokens["refreshToken"], 30*24*60*60*1000, "/", viper.GetString("CLIENT_DOMAIN"), false, true)
	c.JSON(200, map[string]interface{}{
		"user":   dto.User,
		"tokens": dto.Tokens,
	})
}

func (h *Handler) logout(c *gin.Context) {
	token, err := c.Cookie("refreshToken")
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	err = h.service.Authorization.Logout(token)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	c.SetCookie("refreshToken", "", -1, "/", viper.GetString("CLIENT_DOMAIN"), false, true)
}

func (h *Handler) getUserInfo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	info, err := h.service.GetUserInfo(id)
	if err != nil {
		newErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	c.JSON(200, info)
}

func (h *Handler) verify(c *gin.Context) {
	if err := h.service.Authorization.SetActivated(c.Param("id")); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.Redirect(http.StatusPermanentRedirect, viper.GetString("CLIENT_URL"))
}

func (h *Handler) refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	tokens, err := h.service.Authorization.Refresh(refreshToken)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	c.SetCookie("refreshToken", tokens.Tokens["refreshToken"], 30*24*60*60*1000, "/", viper.GetString("CLIENT_DOMAIN"), false, true)
	c.JSON(200, tokens)
}
