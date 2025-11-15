const int joystickXPin = 0;
const int joystickYPin = 1;

void setup() {
  Serial.begin(115200);
  pinMode(joystickXPin, INPUT);
  pinMode(joystickYPin, INPUT);
}

void loop() {
  int xValue = analogRead(joystickXPin);
  int yValue = analogRead(joystickYPin);

  Serial.print(xValue);
  Serial.print(" ");
  Serial.println(yValue);

  delay(100);
}
