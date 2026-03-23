import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

import { cn } from '../../../utils/cn';
import { If } from '../../utility/If';

const IMessageComponent = ({ children }: { children: ReactNode }) => {
  return <div className="mx-auto w-full max-[800px]:p-2">{children}</div>;
};

const IMessage = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded bg-white border border-[#e5e5ea] p-6 text-xl',
        "font-['SanFrancisco',sans-serif]",
        'max-[800px]:text-[1.05rem] max-[800px]:px-3.5 max-[800px]:py-1',
        className
      )}
      {...props}
    />
  );
};

interface MessageBubbleProps {
  from: 'me' | 'them';
  emoji?: boolean;
  noTail?: boolean;
  marginBottom?: 'none' | 'one';
  marginTop?: 'one';
  children?: ReactNode;
  className?: string;
}

const MessageBubble = ({
  from,
  emoji,
  noTail,
  marginBottom,
  marginTop,
  children,
  className,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        'rounded-[1.15rem] leading-[1.25] max-w-[75%] px-3.5 py-2 relative break-words w-fit',
        from === 'me' && [
          'ml-auto bg-[#248bf5] text-white',
          '[&+&]:mt-1',
          'last-of-type:mb-2',
        ],
        from === 'them' && 'self-start bg-[#e5e5ea] text-black',
        emoji && "bg-none text-[3.5rem] before:content-none",
        noTail && 'before:hidden',
        marginBottom === 'none' && 'mb-0',
        marginBottom === 'one' && 'mb-4',
        marginTop === 'one' && 'mt-4',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MessageBubbleTail1Props {
  from: 'me' | 'them';
}
const MessageBubbleTail1 = ({ from }: MessageBubbleTail1Props) => {
  return (
    <div
      className={cn(
        'absolute -bottom-[0.1rem] h-4 w-4',
        from === 'me' &&
          'bg-[#248bf5] -right-[0.35rem] translate-y-[-0.1rem] rounded-bl-[0.8rem_0.7rem]',
        from === 'them' &&
          'bg-[#e5e5ea] -left-[0.35rem] translate-y-[-0.1rem] rounded-br-[0.8rem_0.7rem]'
      )}
    />
  );
};

interface TapbackBubbleImplProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: 'me' | 'them';
  isVisible?: boolean;
}
const TapbackBubbleImpl = forwardRef<HTMLDivElement, TapbackBubbleImplProps>(
  ({ from, isVisible, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute top-0 border-2 border-white visible rounded-full h-9 w-9 p-2 flex items-center',
          'opacity-0 transition-[opacity,transform] duration-200 ease-linear',
          // pseudo-elements for bubble tails
          'before:content-[""] before:rounded-full before:absolute before:-bottom-2 before:w-5 before:h-5 before:scale-[0.28] before:origin-center',
          'after:content-[""] after:rounded-full after:absolute after:-bottom-[5px] after:w-3 after:h-3 after:scale-[0.84] after:origin-center',
          from === 'me' && [
            'left-0 -translate-x-5 -translate-y-[58%] bg-[#e5e5ea] text-[#808080]',
            'before:-left-2.5 before:-bottom-4 before:bg-[#e5e5ea]',
            'after:left-0 after:bg-[#e5e5ea]',
          ],
          from === 'them' && [
            'right-0 translate-x-5 -translate-y-[58%] text-white bg-[#44B2FB]',
            'before:-right-[13px] before:-bottom-3 before:bg-[#44B2FB]',
            'after:-right-0.5 after:-bottom-0.5 after:bg-[#44B2FB]',
          ],
          isVisible && 'opacity-100',
          className
        )}
        {...props}
      />
    );
  }
);

const TapbackOption = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('text-sm leading-none', className)}
      {...props}
    />
  );
};

interface MessageBubbleTail2Props {
  from: 'me' | 'them';
}
const MessageBubbleTail2 = ({ from }: MessageBubbleTail2Props) => {
  return (
    <div
      className={cn(
        'absolute -bottom-[0.1rem] h-4 w-2.5 bg-white',
        from === 'me' &&
          'rounded-bl-[0.5rem] -right-10 -translate-x-[30px] -translate-y-0.5',
        from === 'them' &&
          'rounded-br-[0.5rem] left-5 -translate-x-[30px] -translate-y-0.5'
      )}
    />
  );
};

const MessageBubbleWrapper = ({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'relative p-2 group',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

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
    <MessageBubbleWrapper style={{ paddingTop: 28 }}>
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
  TapbackBubbleImplProps
>(({ from, ...restProps }, ref) => {
  return (
    <TapbackBubbleImpl
      ref={ref}
      from={from}
      data-variant={from}
      className={cn(
        'group-hover:opacity-100',
        from === 'me' && 'group-hover:-translate-x-5 group-hover:-translate-y-[65%]',
        from === 'them' && 'group-hover:translate-x-5 group-hover:-translate-y-[65%]'
      )}
      {...restProps}
    />
  );
});

IMessageComponent.Container = IMessage;
IMessageComponent.MessageBubble = MessageBubbleImpl;
IMessageComponent.TapbackBubble = TapbackBubble;
IMessageComponent.TapbackOption = TapbackOption;

export default IMessageComponent;
