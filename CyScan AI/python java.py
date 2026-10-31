import pygame
import math
import sys

pygame.init()

# Screen settings
WIDTH, HEIGHT = 900, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Glowing Spiral Animation")

clock = pygame.time.Clock()

# Colors
BLACK = (0, 0, 0)
RED = (255, 30, 50)

# Font
font = pygame.font.SysFont("arial", 22, bold=True)

# Change this text
message = "I LOVE PYTHON "
letters = list(message)

# Animation variables
rotation = 0
time = 0

# Create glowing text
def glow_text(char, x, y, angle):
    text = font.render(char, True, RED)

    # Glow layers
    for size in [9, 6, 3]:
        glow = pygame.Surface(
            (text.get_width() + size * 2,
             text.get_height() + size * 2),
            pygame.SRCALPHA
        )

        glow.blit(text, (size, size))
        glow.set_alpha(35)

        rotated = pygame.transform.rotate(
            glow, -math.degrees(angle)
        )

        rect = rotated.get_rect(center=(x, y))
        screen.blit(rotated, rect)

    # Main text
    rotated_text = pygame.transform.rotate(
        text, -math.degrees(angle)
    )

    rect = rotated_text.get_rect(center=(x, y))
    screen.blit(rotated_text, rect)


# Main animation loop
running = True

while running:
    screen.fill(BLACK)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    center_x = WIDTH // 2
    center_y = HEIGHT // 2

    # Pulsing animation
    pulse = 1 + 0.08 * math.sin(time)

    # Spiral effect
    for i in range(260):
        angle = i * 0.23 + rotation
        radius = 2.0 * i * pulse

        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)

        char = letters[i % len(letters)]

        if 0 <= x < WIDTH and 0 <= y < HEIGHT:
            glow_text(char, x, y, angle)

    # Smooth rotation
    rotation += 0.012
    time += 0.035

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()