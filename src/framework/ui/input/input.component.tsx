import React from 'react';
import {
  ImageProps,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import {
  allWithRest,
  Interaction,
  styled,
  StyledComponentProps,
  StyleType,
} from '@kitten/theme';
import {
  Text as TextComponent,
  TextProps,
} from '../text/text.component';
import {
  InputFocusEvent,
  InputEndEditEvent,
} from '../common/type';
import { FlexStyleProps } from '../common/props';

type TextElement = React.ReactElement<TextProps>;
type IconElement = React.ReactElement<ImageProps>;
type IconProp = (style: StyleType) => IconElement;

interface ComponentProps {
  status?: string;
  disabled?: boolean;
  label?: React.ReactText;
  caption?: React.ReactText;
  captionIcon?: IconProp;
  icon?: IconProp;
  textStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  captionTextStyle?: StyleProp<TextStyle>;
}

export type InputProps = StyledComponentProps & TextInputProps & ComponentProps;

const Text = styled<TextProps>(TextComponent);

export class Input extends React.Component<InputProps> {

  static styledComponentName: string = 'Input';

  private onFocus = (event: InputFocusEvent) => {
    this.props.dispatch([Interaction.FOCUSED]);

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  private onEndEditing = (event: InputEndEditEvent) => {
    this.props.dispatch([]);

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event);
    }
  };

  private getComponentStyle = (source: StyleType): StyleType => {
    const {
      style,
      textStyle,
      labelStyle,
      captionTextStyle,
    } = this.props;

    const { rest: inputContainerStyle, ...containerStyle } = allWithRest(StyleSheet.flatten(style), FlexStyleProps);

    const {
      textMarginHorizontal,
      textFontSize,
      textLineHeight,
      textColor,
      iconWidth,
      iconHeight,
      iconMarginHorizontal,
      iconTintColor,
      labelColor,
      labelFontSize,
      labelLineHeight,
      labelMarginBottom,
      labelFontWeight,
      captionMarginTop,
      captionTextColor,
      captionTextFontSize,
      captionTextLineHeight,
      captionTextFontWeight,
      captionIconWidth,
      captionIconHeight,
      captionIconMarginRight,
      captionIconTintColor,
      ...containerParameters
    } = source;

    return {
      container: {
        ...styles.container,
        ...containerStyle,
      },
      inputContainer: {
        ...containerParameters,
        ...styles.inputContainer,
        ...inputContainerStyle,
      },
      captionContainer: {
        marginTop: captionMarginTop,
        ...styles.captionContainer,
      },
      text: {
        marginHorizontal: textMarginHorizontal,
        fontSize: textFontSize,
        lineHeight: textLineHeight,
        color: textColor,
        ...styles.text,
        ...StyleSheet.flatten(textStyle),
      },
      icon: {
        width: iconWidth,
        height: iconHeight,
        marginHorizontal: iconMarginHorizontal,
        tintColor: iconTintColor,
        ...styles.icon,
      },
      label: {
        color: labelColor,
        fontSize: labelFontSize,
        lineHeight: labelLineHeight,
        marginBottom: labelMarginBottom,
        fontWeight: labelFontWeight,
        ...styles.label,
        ...StyleSheet.flatten(labelStyle),
      },
      captionIcon: {
        width: captionIconWidth,
        height: captionIconHeight,
        tintColor: captionIconTintColor,
        marginRight: captionIconMarginRight,
        ...styles.captionIcon,
      },
      captionLabel: {
        fontSize: captionTextFontSize,
        fontWeight: captionTextFontWeight,
        lineHeight: captionTextLineHeight,
        color: captionTextColor,
        ...styles.captionLabel,
        ...StyleSheet.flatten(captionTextStyle),
      },
    };
  };

  private renderIconElement = (style: StyleType): IconElement => {
    const iconElement: IconElement = this.props.icon(style);

    return React.cloneElement(iconElement, {
      key: 0,
      style: [style, iconElement.props.style],
    });
  };

  private renderLabelElement = (style: StyleType): TextElement => {
    return (
      <Text
        key={1}
        style={style}>
        {this.props.label}
      </Text>
    );
  };

  private renderCaptionElement = (style: StyleType): TextElement => {
    return (
      <Text
        key={2}
        style={style}>
        {this.props.caption}
      </Text>
    );
  };

  private renderCaptionIconElement = (style: StyleType): IconElement => {
    const iconElement: IconElement = this.props.captionIcon(style);

    return React.cloneElement(iconElement, {
      key: 3,
      style: [style, iconElement.props.style],
    });
  };

  private renderComponentChildren = (style: StyleType): React.ReactNodeArray => {
    const { icon, label, captionIcon, caption } = this.props;

    return [
      icon && this.renderIconElement(style.icon),
      label && this.renderLabelElement(style.label),
      caption && this.renderCaptionElement(style.captionLabel),
      captionIcon && this.renderCaptionIconElement(style.captionIcon),
    ];
  };

  public render(): React.ReactElement<TextInputProps> {
    const { themedStyle, disabled, ...restProps } = this.props;
    const componentStyle: StyleType = this.getComponentStyle(themedStyle);

    const [
      iconElement,
      labelElement,
      captionElement,
      captionIconElement,
    ] = this.renderComponentChildren(componentStyle);

    return (
      <View style={componentStyle.container}>
        {labelElement}
        <View style={componentStyle.inputContainer}>
          <TextInput
            {...restProps}
            style={componentStyle.text}
            editable={!disabled}
            onFocus={this.onFocus}
            onEndEditing={this.onEndEditing}
          />
          {iconElement}
        </View>
        <View style={componentStyle.captionContainer}>
          {captionIconElement}
          {captionElement}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  icon: {},
  label: {},
  captionIcon: {},
  captionLabel: {},
});
