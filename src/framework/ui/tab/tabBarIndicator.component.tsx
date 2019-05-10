import React from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { StyleType } from '@kitten/theme';

interface ComponentProps {
  positions: number;
  selectedPosition?: number;
  animationDuration?: number;
}

export type TabBarIndicatorProps = ViewProps & ComponentProps;

export class TabBarIndicator extends React.Component<TabBarIndicatorProps> {

  static defaultProps: Partial<TabBarIndicatorProps> = {
    selectedPosition: 0,
    animationDuration: 200,
  };

  private contentOffset: Animated.Value = new Animated.Value(0);
  private indicatorWidth: number;

  public componentDidMount() {
    this.contentOffset.addListener(this.onContentOffsetAnimationStateChanged);
  }

  public shouldComponentUpdate(nextProps: TabBarIndicatorProps): boolean {
    return this.props.selectedPosition !== nextProps.selectedPosition;
  }

  public componentDidUpdate() {
    const { selectedPosition: index } = this.props;

    this.scrollToIndex({
      index,
      animated: true,
    });
  }

  public componentWillUnmount() {
    this.contentOffset.removeAllListeners();
  }

  /**
   * scrolls indicator to passed index
   *
   * @param params (object) - {
   *  index: number,
   *  animated: boolean | undefined
   * }
   */
  public scrollToIndex(params: { index: number, animated?: boolean }) {
    const { index, ...rest } = params;
    const offset: number = this.indicatorWidth * index;

    this.scrollToOffset({ offset, ...rest });
  }

  /**
   * scrolls indicator to passed offset
   *
   * @param params (object) - {
   *  offset: number,
   *  animated: boolean | undefined
   * }
   */
  public scrollToOffset(params: { offset: number, animated?: boolean }) {
    this.createOffsetAnimation(params).start(this.onContentOffsetAnimationStateEnd);
  }

  private onContentOffsetAnimationStateChanged = (state: { value: number }) => {
    // no-op
  };

  private onContentOffsetAnimationStateEnd = (result: { finished: boolean }) => {
    // no-op
  };

  private createOffsetAnimation = (params: { offset: number, animated?: boolean }): Animated.CompositeAnimation => {
    const animationDuration: number = params.animated ? this.props.animationDuration : 0;

    return Animated.timing(this.contentOffset, {
      toValue: params.offset,
      duration: animationDuration,
      easing: Easing.linear,
    });
  };

  private onLayout = (event: LayoutChangeEvent) => {
    this.indicatorWidth = event.nativeEvent.layout.width;

    this.scrollToOffset({
      offset: this.indicatorWidth * this.props.selectedPosition,
    });
  };

  private getComponentStyle = (source: StyleType): StyleType => {
    const { style, positions } = this.props;

    const widthPercent: number = 100 / positions;

    return {
      ...source,
      ...StyleSheet.flatten(style),
      width: `${widthPercent}%`,
      transform: [{ translateX: this.contentOffset }],
    };
  };

  public render(): React.ReactElement<ViewProps> {
    const componentStyle: StyleType = this.getComponentStyle(this.props.style);

    return (
      <Animated.View
        {...this.props}
        onLayout={this.onLayout}
        style={componentStyle}
      />
    );
  }
}
