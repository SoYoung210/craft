import { Command as CmdkCommand } from 'cmdk';

import { styled } from '../../../stitches.config';

const StyledCommand = styled(CmdkCommand, {
  maxWidth: 640,
  width: '100%',
  backgroundColor: '#fcfcfc',
  boxShadow: '0 16px 70px rgba(0,0,0,.2)',
  border: '1px solid #e2e2e2',
  borderRadius: 12,
  py: 8,
});

const StyledInput = styled(CmdkCommand.Input, {
  border: 'none',
  width: '100%',
  fontSize: 15,
  py: 8,
  px: 16,
  outline: 'none',
  color: '$gray10',

  '&:placeholder': {
    color: '$gray6',
  },
});

const StyledItem = styled(CmdkCommand.Item, {
  cursor: 'pointer',
  height: 40,
  borderRadius: 8,
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  px: 8,

  willChange: 'background, color',
  transitionProperty: 'background, color',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease',

  '&[aria-selected="true"]': {
    background: '#ededed',
    color: '$gray10',
  },

  '&:active': {
    background: '$gray2',
  },

  '&:first-child': {
    marginTop: 8,
  },

  '& + &': {
    marginTop: 4,
  },
});

const StyledList = styled(CmdkCommand.List, {
  px: 8,
  paddingBottom: 40,
  overflow: 'auto',
  // TODO: radix scroll area로 변경
  overscrollBehavior: 'contain',
});

const StyledDivider = styled('hr', {
  border: 0,
  width: '100%',
  left: 0,
  height: 1,
  background: '$gray2',
  position: 'relative',
  overflow: 'visible',
  display: 'block',
  marginTop: '12px',
  marginBottom: '12px',
});

export const Command = Object.assign({}, StyledCommand, {
  Input: StyledInput,
  Item: StyledItem,
  List: StyledList,
  Divider: StyledDivider,
});
