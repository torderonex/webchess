package main

import (
	"os"

	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"github.com/subosito/gotenv"
	"github.com/torderonex/webchess/server/internal/handler"
	"github.com/torderonex/webchess/server/internal/repository"
	"github.com/torderonex/webchess/server/internal/service"
	"github.com/torderonex/webchess/server/pkg/postgres"
	"github.com/torderonex/webchess/server/pkg/server"
)

func initConfig() error {
	viper.AddConfigPath("../../config")
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	return viper.ReadInConfig()
}

func init() {
	logrus.SetFormatter(new(logrus.JSONFormatter))
	if err := gotenv.Load("../../.env"); err != nil {
		logrus.Fatal(err, ".env file load error")
	}
	if err := initConfig(); err != nil {
		logrus.Fatal(err, "config.yaml load error")
	}
}

func main() {
	cfgDB := viper.GetStringMapString("postgres")

	psql, err := postgres.NewPostgresDB(postgres.Config{
		Host:     cfgDB["host"],
		Port:     cfgDB["port"],
		Username: cfgDB["username"],
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   cfgDB["dbname"],
		SSLMode:  cfgDB["sslmode"],
	})
	if err != nil {
		logrus.Fatal(err)
	}
	cfgMap := viper.GetStringMapString("EMAIL")
	cfgMail := service.MailConfig{
		Email:      cfgMap["username"],
		SMTPPort:   cfgMap["smtp_port"],
		SMTPServer: cfgMap["server"],
		Password:   os.Getenv("EMAIL_PASSWORD"),
	}
	repo := repository.NewRepository(psql)
	s := service.NewService(repo, cfgMail)
	h := handler.New(s)
	srv := new(server.Server)
	logrus.Fatal(srv.Run("8080", h.InitRoutes()))
}
