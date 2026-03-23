import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Command as CmdkCommand } from 'cmdk';
import { cn } from '../../utils/cn';

const StyledCommand = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CmdkCommand>
>(({ className, ...props }, ref) => (
  <CmdkCommand
    ref={ref}
    className={cn(
      'max-w-[640px] w-full bg-[#fcfcfc] shadow-[0_16px_70px_rgba(0,0,0,.2)] border border-[#e2e2e2] rounded-xl py-2',
      className
    )}
    {...props}
  />
));

const StyledInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof CmdkCommand.Input>
>(({ className, ...props }, ref) => (
  <CmdkCommand.Input
    ref={ref}
    className={cn(
      'border-none w-full text-[15px] py-2 px-4 outline-none text-gray-10 placeholder:text-gray-6',
      className
    )}
    {...props}
  />
));

const StyledItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CmdkCommand.Item>
>(({ className, ...props }, ref) => (
  <CmdkCommand.Item
    ref={ref}
    className={cn(
      'cursor-pointer h-10 rounded-lg text-sm flex items-center gap-2 px-2',
      'transition-[background,color] duration-150 ease-in-out',
      'aria-selected:bg-[#ededed] aria-selected:text-gray-10',
      'active:bg-gray-2',
      'first:mt-2 [&+&]:mt-1',
      className
    )}
    {...props}
  />
));

const StyledList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CmdkCommand.List>
>(({ className, ...props }, ref) => (
  <CmdkCommand.List
    ref={ref}
    className={cn(
      'px-2 pb-10 overflow-auto overscroll-contain',
      className
    )}
    {...props}
  />
));

function StyledDivider({
  className,
  ...props
}: ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      className={cn(
        'border-0 w-full left-0 h-px bg-gray-2 relative overflow-visible block my-3',
        className
      )}
      {...props}
    />
  );
}

export const Command = Object.assign({}, StyledCommand, {
  Input: StyledInput,
  Item: StyledItem,
  List: StyledList,
  Divider: StyledDivider,
});
