import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const CONFETTI_COLORS = ['#6C63FF', '#00D4AA', '#FFD700', '#FF6B6B', '#FFB347', '#00C896', '#E1306C'];
const PARTICLE_COUNT = 40;

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
}

function ConfettiParticle({ particle, screenHeight }: { particle: Particle; screenHeight: number }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 120;
    translateY.value = withDelay(
      particle.delay,
      withTiming(screenHeight + 100, {
        duration: 2500 + Math.random() * 1000,
        easing: Easing.in(Easing.quad),
      })
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(drift, { duration: 2500 + Math.random() * 1000 })
    );
    opacity.value = withDelay(
      particle.delay + 1800,
      withTiming(0, { duration: 800 })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation * 360, { duration: 2500 })
    );
    // Intentionally run only on mount for each particle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: -20,
          width: particle.size,
          height: particle.size * 0.6,
          backgroundColor: particle.color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiOverlayProps {
  visible: boolean;
  onComplete?: () => void;
}

export function ConfettiOverlay({ visible, onComplete }: ConfettiOverlayProps) {
  const { width, height } = useWindowDimensions();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 600,
        rotation: 2 + Math.random() * 4,
      }));
      setParticles(newParticles);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setParticles([]);
        onComplete?.();
      }, 3500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!show || particles.length === 0) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
      }}
    >
      {particles.map((p) => (
        <ConfettiParticle key={p.id} particle={p} screenHeight={height} />
      ))}
    </View>
  );
}
