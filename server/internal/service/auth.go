package service

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/repository"
	"github.com/torderonex/webchess/server/pkg/utils"
)

var validate *validator.Validate

var (
	ValidationError          = errors.New("validation error ")
	UserAlreadyExistError    = errors.New("user with this data is already exists ")
	UserDoesntExistError     = errors.New("user with such data doesnt exist ")
	EmailIsNotActivatedError = errors.New("email is not activated ")
)

type AuthService struct {
	repos  repository.Authorization
	tokens Token
	mail   Mail
}

func NewAuthService(repos repository.Authorization, token Token, mail Mail) *AuthService {
	return &AuthService{
		repos:  repos,
		tokens: token,
		mail:   mail,
	}
}

func (s *AuthService) CreateUser(user entities.Player) (tokens map[string]string, id int, err error) {
	const op = " service.auth.CreateUser"

	tokens = make(map[string]string)
	validate = validator.New()
	if err := validate.Struct(user); err != nil {
		return tokens, id, fmt.Errorf("%w %w %s", ValidationError, err, op)
	}
	_, err = s.repos.GetUser(user.Nickname, user.Password)
	if err == nil {
		return tokens, id, fmt.Errorf("%w %w %s", UserAlreadyExistError, err, op)
	}
	user.Password = utils.GeneratePasswordHash(user.Password)
	user.ConfirmToken = uuid.New().String()
	id, err = s.repos.CreateUser(user)
	if err != nil {
		return tokens, id, fmt.Errorf("%w %w %s", UserAlreadyExistError, err, op)
	}
	if _, err = s.mail.SendConfirmMail(user); err != nil {
		_ = s.repos.DeleteUser(id)
		return tokens, id, errors.New(err.Error() + op)
	}
	tokens = s.tokens.GenerateTokens(Payload{id, user.Roles})
	if err = s.tokens.SaveToken(id, tokens["refreshToken"]); err != nil {
		return tokens, id, err
	}

	return tokens, id, nil
}

func (s *AuthService) Login(user entities.Player) (dto entities.UserDto, err error) {
	const op = " service.auth.Login"

	tokens := make(map[string]string)
	userFromDB, err := s.repos.GetUser(user.Nickname, utils.GeneratePasswordHash(user.Password))
	dto = entities.UserDto{User: entities.NewPlayerInfo(userFromDB), Tokens: tokens}
	if errors.Is(err, sql.ErrNoRows) {
		return dto, fmt.Errorf("%w %w %s", UserDoesntExistError, err, op)
	}
	isRightPassword := utils.PasswordCompare(userFromDB.Password, user.Password)
	if !isRightPassword {
		return dto, fmt.Errorf("%w %w %s", UserDoesntExistError, err, op)
	}
	if userFromDB.ConfirmToken != "" {
		return dto, fmt.Errorf("%w %w %s", EmailIsNotActivatedError, err, op)
	}
	tokens = s.tokens.GenerateTokens(Payload{userFromDB.ID, userFromDB.Roles})
	if err = s.tokens.SaveToken(userFromDB.ID, tokens["refreshToken"]); err != nil {
		return dto, errors.New(err.Error() + op)
	}
	dto.Tokens = tokens
	return dto, nil
}

func (s *AuthService) Logout(refreshToken string) error {
	return s.tokens.DeleteToken(refreshToken)
}

func (s *AuthService) Refresh(refreshToken string) (entities.UserDto, error) {
	const op = " service.auth.Refresh"

	if refreshToken == "" {
		return entities.UserDto{}, errors.New("unauthorized error " + op)
	}
	userData := s.tokens.ValidateRefresh(refreshToken)
	dataFromDB, err := s.tokens.FindToken(refreshToken)
	if !userData || err != nil {
		return entities.UserDto{}, errors.New("unauthorized error " + err.Error() + op)
	}
	player, err := s.repos.GetUserByID(dataFromDB.PlayerID)
	if err != nil {
		return entities.UserDto{}, errors.New(err.Error() + op)
	}
	tokens := s.tokens.GenerateTokens(Payload{PlayerID: player.ID, Roles: player.Roles})
	err = s.tokens.SaveToken(player.ID, tokens["refreshToken"])
	return entities.UserDto{
		User:   player,
		Tokens: tokens,
	}, err
}

func (s *AuthService) GetUserInfo(id int) (entities.PlayerInfo, error) {
	return s.repos.GetUserByID(id)
}
func (s *AuthService) SetActivated(token string) error {
	return s.repos.SetActivated(token)
}

func (s *AuthService) CheckIdentity(refreshToken string) (Payload, error) {
	return s.tokens.ParseToken(refreshToken, signingKeyRefresh)
}

func (s *AuthService) ResetPassword(email, password string) error {
	return nil
}
