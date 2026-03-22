import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const CONFETTI_COLORS = ['#6C63FF', '#8B5CF6', '#00D4AA', '#FFD700', '#FF6B6B', '#FFB347', '#00C896', '#F06292', '#5B9BF5'];
const PARTICLE_COUNT = 55;

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
  isCircle: boolean;
}

function ConfettiParticle({ particle, screenHeight }: { particle: Particle; screenHeight: number }) {
  const translateY = useSharedValue(-60);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 160;
    const dur = 2200 + Math.random() * 1200;

    // Pop in
    scale.value = withDelay(particle.delay, withSpring(1, { damping: 8, stiffness: 200 }));

    translateY.value = withDelay(
      particle.delay,
      withTiming(screenHeight + 80, { duration: dur, easing: Easing.in(Easing.quad) })
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(drift, { duration: dur })
    );
    opacity.value = withDelay(
      particle.delay + dur * 0.65,
      withTiming(0, { duration: dur * 0.35 })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation * 720, { duration: dur })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: -30,
          width: particle.size,
          height: particle.isCircle ? particle.size : particle.size * 0.55,
          backgroundColor: particle.color,
          borderRadius: particle.isCircle ? particle.size / 2 : 2,
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
        size: 6 + Math.random() * 10,
        delay: Math.random() * 500,
        rotation: 1 + Math.random() * 3,
        isCircle: Math.random() > 0.6,
      }));
      setParticles(newParticles);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setParticles([]);
        onComplete?.();
      }, 3800);

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
