import pygame
import sys

# Inicialização do Pygame
pygame.init()

# Configuração da tela
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Pong")

# Carregar o vídeo de fundo
video_path = "caminho/para/seu/video.mp4"
video = pygame.movie.Movie(video_path)
video_screen = pygame.Surface((screen_width, screen_height)).convert()

# Configuração das raquetes e bola
paddle_width = 10
paddle_height = 100
ball_size = 10

paddle_a = pygame.Rect(50, screen_height // 2 - paddle_height // 2, paddle_width, paddle_height)
paddle_b = pygame.Rect(screen_width - 50 - paddle_width, screen_height // 2 - paddle_height // 2, paddle_width, paddle_height)
ball = pygame.Rect(screen_width // 2 - ball_size // 2, screen_height // 2 - ball_size // 2, ball_size, ball_size)

# Velocidade das raquetes e bola
paddle_speed = 7
ball_speed_x = 4
ball_speed_y = 4

# Pontuação
score_a = 0
score_b = 0
font = pygame.font.Font(None, 74)

# Função para desenhar tudo na tela
def draw():
    screen.fill((0, 0, 0))
    screen.blit(video_screen, (0, 0))
    pygame.draw.rect(screen, (255, 255, 255), paddle_a)
    pygame.draw.rect(screen, (255, 255, 255), paddle_b)
    pygame.draw.ellipse(screen, (255, 255, 255), ball)
    text = font.render(f"{score_a}", True, (255, 255, 255))
    screen.blit(text, (screen_width // 4, 20))
    text = font.render(f"{score_b}", True, (255, 255, 255))
    screen.blit(text, (screen_width * 3 // 4, 20))

# Função para mover as raquetes
def move_paddles(keys):
    if keys[pygame.K_w] and paddle_a.top > 0:
        paddle_a.y -= paddle_speed
    if keys[pygame.K_s] and paddle_a.bottom < screen_height:
        paddle_a.y += paddle_speed
    if keys[pygame.K_UP] and paddle_b.top > 0:
        paddle_b.y -= paddle_speed
    if keys[pygame.K_DOWN] and paddle_b.bottom < screen_height:
        paddle_b.y += paddle_speed

# Loop principal do jogo
video.set_display(video_screen)
video.play()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    move_paddles(keys)

    # Movimentação da bola
    ball.x += ball_speed_x
    ball.y += ball_speed_y

    # Verificar colisão com a borda superior e inferior
    if ball.top <= 0 or ball.bottom >= screen_height:
        ball_speed_y *= -1

    # Verificar colisão com as raquetes
    if ball.colliderect(paddle_a) or ball.colliderect(paddle_b):
        ball_speed_x *= -1

    # Verificar pontuação
    if ball.left <= 0:
        score_b += 1
        ball.center = (screen_width // 2, screen_height // 2)
        ball_speed_x *= -1
    if ball.right >= screen_width:
        score_a += 1
        ball.center = (screen_width // 2, screen_height // 2)
        ball_speed_x *= -1

    draw()
    pygame.display.flip()
    pygame.time.Clock().tick(60)
