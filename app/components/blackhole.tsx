'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';

const BokehBackground: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sketch = (p: p5) => {
        class Bubble {
          x: number;
          y: number;
          size: number;
          baseSize: number;
          color: [number, number, number, number];
          speedX: number;
          speedY: number;
          opacity: number;

          constructor(size: number, color: [number, number, number, number], speedX: number, speedY: number) {
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
            const [r, g, b, a] = this.color;
            p.fill(r, g, b, this.opacity);

            // Aplicar blur fuerte en la propia burbuja
            p.drawingContext.shadowBlur = 150; // Blur más alto para difuminar más
            p.drawingContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`; // Color de la sombra más cercano a la burbuja
            p.ellipse(this.x, this.y, this.size); // Dibujar la burbuja
          }
        }

        const bubbles: Bubble[] = [];

        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.parent(sketchRef.current as Element);

          // Crear burbujas iniciales con menos cantidad y tonos más cian
          for (let i = 0; i < 12; i++) {
            const size = p.random(100, 220); // Tamaños más grandes
            const speedX = p.random(-1, 1);
            const speedY = p.random(-1, 1);
            const color: [number, number, number, number] = [
              p.random(80, 150), // Colores más suaves
              p.random(180, 220),
              p.random(220, 255),
              p.random(80, 100),
            ];
            bubbles.push(new Bubble(size, color, speedX, speedY));
          }
        };

        p.draw = () => {
          p.clear(); // Limpiar el canvas

          // Dibujar las burbujas con movimiento y rebote
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

  return (
    <main className="fixed -z-10 top-0 left-0">
      <div className="w-full h-[100dvh] absolute backdrop-blur-xl top-0 left-0"></div>
      <div ref={sketchRef} className="inset-0" />
    </main>
  );
};

// Uso de dynamic para evitar errores de window en la generación estática
export default dynamic(() => Promise.resolve(BokehBackground), {
  ssr: false,
});
