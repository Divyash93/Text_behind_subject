'use client';

import { useCallback } from "react";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "@tsparticles/react";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: false,
          zIndex: 0,
        },
        particles: {
          number: {
            value: 20,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#8692FE"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.7,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.2,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.2,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out"
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: 10,
              duration: 2,
              opacity: 1
            }
          }
        },
        retina_detect: true,
        background: {
          color: "transparent",
          position: "50% 50%",
          repeat: "no-repeat",
          size: "cover"
        }
      }}
    />
  );
}
