package service

import (
	"fmt"
	"github.com/go-gomail/gomail"
	"github.com/spf13/viper"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/repository"
	"strconv"
)

type MailConfig struct {
	Email      string
	SMTPPort   string
	SMTPServer string
	Password   string
}

type MailService struct {
	Config MailConfig
	Repos  repository.Authorization
}

func NewMailService(cfg MailConfig, repos repository.Authorization) *MailService {
	return &MailService{Config: cfg, Repos: repos}
}

func (m *MailService) SendConfirmMail(user entities.Player) (string, error) {
	const op = "service.mail.SendConfirmMail"

	confirmToken, err := m.Repos.GetConfirmToken(user)
	if err != nil {
		return "", nil
	}
	msg := fmt.Sprintf("<h1>WebChess Подтверждение почты</h1><div>Перейдите по <a href=\"%s\"> ссылке </a> для подтверждении почты на %s</div>\r\n", viper.GetString("SERVER_URL")+"/api/account/verify/"+confirmToken, viper.GetString("SERVER_URL")+"/api/account/verify/"+confirmToken)
	ms := gomail.NewMessage()
	ms.SetHeader("From", m.Config.Email)
	ms.SetHeader("To", user.Email)
	ms.SetHeader("Subject", "Подтверждение почты WebChess!")
	ms.SetBody("text/html", msg)
	port, err := strconv.Atoi(m.Config.SMTPPort)
	if err != nil {
		return "", fmt.Errorf("%w %s", err, op)
	}
	d := gomail.NewDialer(m.Config.SMTPServer, port, m.Config.Email, m.Config.Password)
	if err := d.DialAndSend(ms); err != nil {
		return "", fmt.Errorf("%w %s", err, op)
	}
	return confirmToken, nil
}

// todo
func (m *MailService) SendPasswordResetMail(email string) (string, error) {
	return "newPassword", nil
}
