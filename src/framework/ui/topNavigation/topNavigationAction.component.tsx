import React from 'react';
import {
  GestureResponderEvent,
  ImageProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {
  Interaction,
  StyledComponentProps,
  StyleType,
} from '@kitten/theme';

type IconElement = React.ReactElement<ImageProps>;
type IconProp = (style: StyleType) => IconElement;

interface ComponentProps {
  icon: IconProp;
}

export type TopNavigationActionProps = StyledComponentProps & TouchableOpacityProps & ComponentProps;

export class TopNavigationAction extends React.Component<TopNavigationActionProps> {

  static styledComponentName: string = 'TopNavigationAction';

  private onPress = (event: GestureResponderEvent) => {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  };

  private onPressIn = (event: GestureResponderEvent) => {
    this.props.dispatch([Interaction.ACTIVE]);

    if (this.props.onPressIn) {
      this.props.onPressIn(event);
    }
  };

  private onPressOut = (event: GestureResponderEvent) => {
    this.props.dispatch([]);

    if (this.props.onPressOut) {
      this.props.onPressOut(event);
    }
  };

  private getComponentStyle = (source: StyleType): StyleType => {
    const { iconTintColor, ...containerParameters } = source;

    return {
      container: {
        ...containerParameters,
        ...styles.container,
        ...StyleSheet.flatten(this.props.style),
      },
      icon: {
        tintColor: iconTintColor,
        ...styles.icon,
      },
    };
  };

  private renderIconElement = (style: StyleType): React.ReactElement<ImageProps> => {
    const iconElement = this.props.icon(style);

    return React.cloneElement(iconElement, {
      style: [style, iconElement.props.style],
    });
  };

  public render(): React.ReactNode {
    const { themedStyle, icon, ...touchableProps } = this.props;

    const componentStyle: StyleType = this.getComponentStyle(themedStyle);

    return (
      <TouchableOpacity
        activeOpacity={1.0}
        {...touchableProps}
        style={componentStyle.container}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}>
        {this.renderIconElement(componentStyle.icon)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  icon: {
    flex: 1,
  },
});
