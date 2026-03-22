import React, { useState } from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  title?: string;
}

export function BarChart({ data, height = 160, title }: BarChartProps) {
  const { colors } = useTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartPadding = 6;
  const chartHeight = height - 28;

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
          {data.map((item, i) => {
            const barHeight = Math.max(
              (item.value / maxValue) * (chartHeight - 18),
              item.value > 0 ? 4 : 0
            );
            const x =
              chartPadding +
              (i * (chartWidth - chartPadding * 2)) / data.length +
              ((chartWidth - chartPadding * 2) / data.length - barWidth) / 2;
            const y = chartHeight - barHeight;

            return (
              <React.Fragment key={item.label}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={5}
                  fill={colors.primary}
                  opacity={0.9}
                />
                {item.value > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 5}
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
