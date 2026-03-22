import React, { useState, useEffect } from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  title?: string;
}

function AnimatedBar({
  x,
  maxBarHeight,
  barWidth,
  value,
  maxValue,
  index,
}: {
  x: number;
  maxBarHeight: number;
  barWidth: number;
  value: number;
  maxValue: number;
  index: number;
}) {
  const targetHeight = Math.max((value / maxValue) * maxBarHeight, value > 0 ? 4 : 0);
  const barHeight = useSharedValue(0);

  useEffect(() => {
    barHeight.value = withDelay(
      index * 80,
      withTiming(targetHeight, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetHeight]);

  const animatedProps = useAnimatedProps(() => ({
    height: barHeight.value,
    y: maxBarHeight - barHeight.value,
  }));

  return (
    <AnimatedRect
      x={x}
      width={barWidth}
      rx={barWidth / 2.5}
      fill="url(#barGrad)"
      animatedProps={animatedProps}
    />
  );
}

export function BarChart({ data, height = 160, title }: BarChartProps) {
  const { colors } = useTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartPadding = 6;
  const labelHeight = 28;
  const maxBarHeight = height - labelHeight - 20;

  const handleLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

  if (data.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height, gap: 8 }}>
        <Text style={{ fontFamily: Fonts.medium, fontSize: 12, color: colors.textTertiary }}>
          No earnings data
        </Text>
      </View>
    );
  }

  const barWidth = chartWidth > 0
    ? Math.min(22, (chartWidth - chartPadding * 2) / data.length - 6)
    : 18;

  return (
    <View style={{ gap: 6 }} onLayout={handleLayout}>
      {title && (
        <Text
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: 13,
            color: colors.textSecondary,
          }}
        >
          {title}
        </Text>
      )}
      {chartWidth > 0 && (
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="100%" stopColor="#6C63FF" />
            </LinearGradient>
          </Defs>
          {data.map((item, i) => {
            const x =
              chartPadding +
              (i * (chartWidth - chartPadding * 2)) / data.length +
              ((chartWidth - chartPadding * 2) / data.length - barWidth) / 2;

            return (
              <React.Fragment key={item.label}>
                <AnimatedBar
                  x={x}
                  maxBarHeight={maxBarHeight}
                  barWidth={barWidth}
                  value={item.value}
                  maxValue={maxValue}
                  index={i}
                />
                {item.value > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={maxBarHeight - (item.value / maxValue) * maxBarHeight - 6}
                    fill={colors.textSecondary}
                    fontSize={9}
                    fontFamily={Fonts.semiBold}
                    textAnchor="middle"
                  >
                    {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : `$${item.value}`}
                  </SvgText>
                )}
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 4}
                  fill={colors.textTertiary}
                  fontSize={9}
                  fontFamily={Fonts.medium}
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      )}
    </View>
  );
}
