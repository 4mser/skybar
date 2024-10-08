'use client';
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const BokehBackground: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo ejecutar en el lado del cliente
    if (typeof window !== 'undefined') {
      const sketch = (p: p5) => {
        class Bubble {
          x: number;
          y: number;
          size: number;
          baseSize: number;
          color: [number, number, number];
          speedX: number;
          speedY: number;
          opacity: number;

          constructor(size: number, color: [number, number, number], speedX: number, speedY: number) {
            this.size = size;
            this.baseSize = size;
            this.x = p.random(p.width); 
            this.y = p.random(p.height);
            this.color = color;
            this.speedX = speedX; 
            this.speedY = speedY;
            this.opacity = p.random(20, 50); // Opacidades más sutiles
          }

          move() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Rebote en los bordes
            if (this.x - this.size / 2 < 0 || this.x + this.size / 2 > p.width) {
              this.speedX *= -1; 
            }
            if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > p.height) {
              this.speedY *= -1; 
            }

            // Cambio de tamaño suave
            this.size = this.baseSize + p.sin(p.frameCount * 0.01) * 10;
          }

          show() {
            p.noStroke();
            const [r, g, b] = this.color;
            p.fill(r, g, b, this.opacity);

            // Aplicar blur fuerte en la propia burbuja, pero reducir en dispositivos pequeños
            const blurAmount = p.windowWidth < 768 ? 50 : 150; // Ajustar blur según el tamaño de pantalla
            p.drawingContext.shadowBlur = blurAmount;
            p.drawingContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
            p.ellipse(this.x, this.y, this.size);
          }
        }

        const bubbles: Bubble[] = [];

        // Ajustar el número de burbujas según el tamaño de pantalla
        const numBubbles = p.windowWidth < 768 ? 6 : 12; // Menos burbujas en pantallas pequeñas

        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.parent(sketchRef.current as Element);

          for (let i = 0; i < numBubbles; i++) {
            const size = p.random(100, 220); 
            const speedX = p.random(-1, 1); 
            const speedY = p.random(-1, 1); 
            const color: [number, number, number] = [
              p.random(80, 150),
              p.random(180, 220),
              p.random(220, 255),
            ];
            bubbles.push(new Bubble(size, color, speedX, speedY));
          }
        };

        p.draw = () => {
          p.clear();

          // Dibujar las burbujas
          for (const bubble of bubbles) {
            bubble.move();
            bubble.show();
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };

      const p5Instance = new p5(sketch);

      return () => {
        p5Instance.remove();
      };
    }
  }, []);

  return <div ref={sketchRef} className="fixed -z-20 inset-0" />;
};

export default BokehBackground;
