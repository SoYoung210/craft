import { forwardRef, ReactNode } from 'react';

import { styled } from '../../../../stitches.config';
import { If } from '../../utility/If';

const IMessageComponent = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled('div', {
  margin: '0 auto',
  maxWidth: 600,
  padding: '1rem',
  width: '100%',

  '@media screen and (max-width: 800px)': {
    padding: '0.5rem',
  },
});

const IMessage = styled('div', {
  backgroundColor: '#fff',
  border: '1px solid #e5e5ea',
  borderRadius: '0.25rem',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"SanFrancisco", sans-serif',
  fontSize: '1.25rem',
  maxWidth: 600,
  padding: '0.5rem 1.5rem',

  '@media screen and (max-width: 800px)': {
    fontSize: '1.05rem',
    maxWidth: 600,
    padding: '0.25rem 0.875rem',
  },
});

const MessageBubble = styled('div', {
  borderRadius: '1.15rem',
  lineHeight: 1.25,
  maxWidth: '75%',
  padding: '0.5rem 0.875rem',
  position: 'relative',
  wordWrap: 'break-word',
  width: 'fit-content',

  variants: {
    from: {
      me: {
        marginLeft: 'auto',
        backgroundColor: '#248bf5',
        color: '#fff',

        '& + &': {
          marginTop: '0.25rem',
        },

        '&:last-of-type': {
          marginBottom: '0.5rem',
        },
      },
      them: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
        color: '#000',
      },
    },
    emoji: {
      true: {
        background: 'none',
        fontSize: '2.5rem',

        '&::before': {
          content: 'none',
        },
      },
    },
    noTail: {
      true: {
        '&::before': {
          display: 'none',
        },
      },
    },
    marginBottom: {
      none: {
        marginBottom: '0',
      },
      one: {
        marginBottom: '1rem',
      },
    },
    marginTop: {
      one: {
        marginTop: '1rem',
      },
    },
  },
});

const MessageBubbleTail1 = styled('div', {
  bottom: '-0.1rem',
  height: '1rem',
  width: '1rem',
  position: 'absolute',

  variants: {
    from: {
      me: {
        backgroundColor: '#248bf5',
        right: '-0.35rem',
        transform: 'translate(0, -0.1rem)',
        borderBottomLeftRadius: '0.8rem 0.7rem',
      },
      them: {
        borderBottomRightRadius: '0.8rem 0.7rem',
        backgroundColor: '#e5e5ea',
        left: '-0.35rem',
        transform: 'translate(0, -0.1rem)',
      },
    },
  },
});

const TapbackBubbleImpl = styled('div', {
  position: 'absolute',
  top: 0,

  border: '2px solid white',
  visibility: 'visible',
  borderRadius: 999,
  height: 36,
  width: 36,
  padding: '8px',
  display: 'flex',
  alignItems: 'center',

  opacity: 0,
  transition: 'opacity 200ms ease, transform 200ms ease',

  '&::before': {
    content: '""',
    borderRadius: '999px',
    position: 'absolute',
    bottom: '-8px',
    width: '20px',
    height: '20px',
    transform: 'scale(0.28)',
    transformOrigin: 'center',
  },

  '&::after': {
    content: '""',
    borderRadius: '999px',
    position: 'absolute',
    bottom: '-5px',
    width: '12px',
    height: '12px',
    transform: 'scale(0.84)',
    transformOrigin: 'center',
  },

  variants: {
    from: {
      me: {
        left: 0,
        // transform: 'translateX(-20px) translateY(-65%)',
        transform: 'translateX(-20px) translateY(-50%)',
        backgroundColor: '#e5e5ea',
        color: '#808080',
        '&::before': {
          left: '-10px',
          bottom: '-16px',
          backgroundColor: '#e5e5ea',
        },
        '&::after': {
          left: 0,
          backgroundColor: '#e5e5ea',
        },
      },
      them: {
        right: '0',
        // transform: 'translateX(20px) translateY(-65%)',
        transform: 'translateX(20px) translateY(-50%)',
        color: 'white',
        backgroundColor: '#2D9BFD',
        '&::before': {
          right: '-13px',
          bottom: '-12px',
          backgroundColor: '#2D9BFD',
        },
        '&::after': {
          right: '-2px',
          bottom: '-2px',
          backgroundColor: '#2D9BFD',
        },
      },
    },
    isVisible: {
      true: {
        opacity: 1,
      },
    },
  },
});
const TapbackOption = styled('div', {
  fontSize: '14px',
  lineHeight: 0,
});

const MessageBubbleTail2 = styled('div', {
  bottom: '-0.1rem',
  height: '1rem',
  width: '10px',
  position: 'absolute',
  backgroundColor: '#fff',

  variants: {
    from: {
      me: {
        borderBottomLeftRadius: '0.5rem',
        right: '-40px',
        transform: 'translate(-30px, -2px)',
      },
      them: {
        borderBottomRightRadius: '0.5rem',
        left: '20px',
        transform: 'translate(-30px, -2px)',
      },
    },
  },
});
const MessageBubbleWrapper = styled('div', {
  position: 'relative',
  padding: '0.5rem',

  '&:hover': {
    [`& ${TapbackBubbleImpl}`]: {
      opacity: 1,
    },

    [`& ${TapbackBubbleImpl}[data-variant="me"]`]: {
      transform: 'translateX(-20px) translateY(-65%)',
    },
    [`& ${TapbackBubbleImpl}[data-variant="them"]`]: {
      transform: 'translateX(20px) translateY(-65%)',
    },
  },
});
interface MessageBubbleImplProps {
  from: 'me' | 'them';
  children: React.ReactNode;
  emoji?: boolean;
  noTail?: boolean;
  marginBottom?: 'none' | 'one';
  marginTop?: 'one';
}

const MessageBubbleImpl = (props: MessageBubbleImplProps) => {
  const { from, children, emoji, noTail, marginBottom, marginTop } = props;

  return (
    <MessageBubbleWrapper style={{ paddingTop: '28px' }}>
      <MessageBubble
        from={from}
        emoji={emoji}
        noTail={noTail}
        marginBottom={marginBottom}
        marginTop={marginTop}
      >
        <If condition={from === 'me' && !noTail}>
          <MessageBubbleTail1 from="me" />
        </If>

        <If condition={from === 'them' && !noTail}>
          <MessageBubbleTail1 from="them" />
        </If>
        {children}
        <If condition={from === 'me' && !noTail}>
          <MessageBubbleTail2 from="me" />
        </If>
        <If condition={from === 'them' && !noTail}>
          <MessageBubbleTail2 from="them" />
        </If>
      </MessageBubble>
    </MessageBubbleWrapper>
  );
};

const TapbackBubble = forwardRef<
  HTMLDivElement,
  { from: 'me' | 'them'; children: ReactNode }
>(({ from, ...restProps }, ref) => {
  return (
    <TapbackBubbleImpl
      ref={ref}
      from={from}
      data-variant={from}
      {...restProps}
    />
  );
});

IMessageComponent.Container = IMessage;
IMessageComponent.MessageBubble = MessageBubbleImpl;
IMessageComponent.TapbackBubble = TapbackBubble;
IMessageComponent.TapbackOption = TapbackOption;

export default IMessageComponent;
