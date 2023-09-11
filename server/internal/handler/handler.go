package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/torderonex/webchess/server/internal/service"
)

type Handler struct {
	service *service.Service
}

func New(s *service.Service) *Handler {
	return &Handler{
		service: s,
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()
	router.Use(corsMiddleware())
	lobbyAPI := router.Group("/api/lobby")
	{
		lobbyAPI.POST("/create", h.create)
		lobbyAPI.DELETE("/delete", h.delete)
		lobbyAPI.POST("/finishgame", h.finishGame)
		lobbyAPI.POST("/join", h.join)
		lobbyAPI.GET("/info/:id", h.getGameInfo)
	}
	router.GET("/observe/:id", h.observe)
	accountAPI := router.Group("/api/account")
	{
		accountAPI.POST("/register", h.register)
		accountAPI.POST("/login", h.login)
		accountAPI.POST("/logout", h.logout)
		accountAPI.GET("/verify/:id", h.verify)
		accountAPI.GET("/userinfo/:id", h.getUserInfo)
		accountAPI.GET("/refresh", h.refresh)
	}
	return router
}
