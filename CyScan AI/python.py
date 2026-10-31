
import turtle
import math

screen = turtle.Screen()
screen.bgcolor("black")
screen.title("Spiral Art")

pen = turtle.Turtle()
pen.speed(0)
pen.hideturtle()
pen.color("red")
pen.penup()

message = "I LOVE PYTHON "

for i in range(1200):
    angle = i * 0.15
    radius = 0.15 * i

    x = radius * math.cos(angle)
    y = radius * math.sin(angle)

    pen.goto(x, y)
    pen.setheading(math.degrees(angle) + 90)
    pen.write(message[i % len(message)],
              align="center",
              font=("Arial", 9, "bold"))

turtle.done()
