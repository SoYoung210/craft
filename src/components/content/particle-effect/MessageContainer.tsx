import { ReactNode } from 'react';

import { styled } from '../../../../stitches.config';

const IMessageComponent = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled('div', {
  margin: '0 auto',
  maxWidth: 600,
  padding: '1rem',

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
  margin: '0 auto 1rem',
  maxWidth: 600,
  padding: '0.5rem 1.5rem',

  '@media screen and (max-width: 800px)': {
    fontSize: '1.05rem',
    margin: '0 auto 1rem',
    maxWidth: 600,
    padding: '0.25rem 0.875rem',
  },
});

const MessageBubble = styled('p', {
  borderRadius: '1.15rem',
  lineHeight: 1.25,
  maxWidth: '75%',
  padding: '0.5rem 0.875rem',
  position: 'relative',
  wordWrap: 'break-word',
  margin: '0.5rem 0',
  width: 'fit-content',

  '&::before, &::after': {
    bottom: '-0.1rem',
    content: '""',
    height: '1rem',
    position: 'absolute',
  },

  variants: {
    from: {
      me: {
        alignSelf: 'flex-end',
        backgroundColor: '#248bf5',
        color: '#fff',

        '&::before': {
          borderBottomLeftRadius: '0.8rem 0.7rem',
          borderRight: '1rem solid #248bf5',
          right: '-0.35rem',
          transform: 'translate(0, -0.1rem)',
        },

        '&::after': {
          backgroundColor: '#fff',
          borderBottomLeftRadius: '0.5rem',
          right: '-40px',
          transform: 'translate(-30px, -2px)',
          width: '10px',
        },

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

        '&::before': {
          borderBottomRightRadius: '0.8rem 0.7rem',
          borderLeft: '1rem solid #e5e5ea',
          left: '-0.35rem',
          transform: 'translate(0, -0.1rem)',
        },

        '&::after': {
          backgroundColor: '#fff',
          borderBottomRightRadius: '0.5rem',
          left: '20px',
          transform: 'translate(-30px, -2px)',
          width: '10px',
        },
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

IMessageComponent.Container = IMessage;
IMessageComponent.MessageBubble = MessageBubble;

export default IMessageComponent;
