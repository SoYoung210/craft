import React, {
  useCallback,
  useState,
  useRef,
  memo,
} from 'https://cdn.skypack.dev/react';
import { nanoid } from 'https://cdn.skypack.dev/nanoid';
import {
  BsCheckLg,
  BsXLg,
  BsInfoLg,
  BsExclamationLg,
} from 'https://cdn.skypack.dev/react-icons/bs';
import { MdClose, MdAdd } from 'https://cdn.skypack.dev/react-icons/md';
import {
  TransitionGroup,
  CSSTransition,
} from 'https://cdn.skypack.dev/react-transition-group';

const TIMEOUT = 5000; // Notifications will be removed automatically after 5 seconds, unless hovered over.
const ANIMATION_DURATION = 400;
const MAX_NOTIFICATIONS = 5;
const STACKING_OVERLAP = 0.9; // A range from 0 to 1 representing the percentage of the notification's height that should overlap the next notification
const NOTIFICATION_ICON = {
  success: BsCheckLg,
  error: BsXLg,
  info: BsInfoLg,
  warning: BsExclamationLg,
};

enum Type {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
}

type Notification = {
  id?: string;
  type: Type;
  title: string;
  content: string;
  timeout: number;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const useNotifications = () => {
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const paused = useRef(null);
  const [notifications, setNotifications] = useState([] as Notification[]);

  const add = useCallback((n: Notification) => {
    const notification = { ...n };
    notification.id = nanoid();
    notification.timeout += Date.now();
    setNotifications(n => {
      const next = [notification, ...n];
      if (n.length >= MAX_NOTIFICATIONS) {
        next.pop();
      }
      return next;
    });
    timeouts.current.push(
      setTimeout(() => {
        remove(notification.id);
      }, notification.timeout - Date.now())
    );
  }, []);

  const pause = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    paused.current = Date.now();
  }, []);

  const resume = useCallback(() => {
    setNotifications(n => {
      return n.map(notification => {
        notification.timeout += Date.now() - paused.current;
        timeouts.current.push(
          setTimeout(() => {
            remove(notification.id);
          }, notification.timeout - Date.now())
        );
        return notification;
      });
    });
  }, [notifications]);

  const remove = useCallback((id: string) => {
    setNotifications(n => n.filter(n => n.id !== id));
  }, []);

  const props = { notifications, remove, pause, resume };

  return { props, add };
};

interface NotificationProps extends Notification {
  index: number;
  total: number;
  remove: (id: string) => void;
}

const Notification = memo(
  ({ id, title, content, type, index, total, remove }: NotificationProps) => {
    const Icon = NOTIFICATION_ICON[type];
    const inverseIndex = total - index - 1;
    const scale = 1 - inverseIndex * 0.05;
    const opacity = 1 - (inverseIndex / total) * 0.1;
    const bg = `hsl(0 0% ${100 - inverseIndex * 15}% / 40%)`;
    const y = inverseIndex * 100 * STACKING_OVERLAP;

    return (
      <div
        className="notification"
        style={{
          '--bg': bg,
          '--opacity': opacity,
          '--scale': scale,
          '--y': `${y}%`,
        }}
      >
        <div className="notification-inner">
          <div className={`icon ${type}`}>
            <Icon />
          </div>
          <div>
            <h2>{title}</h2>
            <p>{content}</p>
          </div>
          <button className="close" onClick={() => remove(id)}>
            <MdClose />
          </button>
        </div>
      </div>
    );
  }
);

interface NotificationsProps {
  notifications: Notification[];
  remove: (id: string) => void;
  pause: () => void;
  resume: () => void;
  animationDuration: number;
}

const Notifications = ({
  notifications,
  remove,
  pause,
  resume,
  animationDuration,
}: NotificationsProps) => {
  return (
    <TransitionGroup
      className="notifications"
      style={{ '--duration': `${animationDuration}ms` }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {[...notifications].reverse().map((notification, index) => {
        return (
          <CSSTransition key={notification.id} timeout={animationDuration}>
            <Notification
              {...notification}
              remove={remove}
              index={index}
              total={notifications.length}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

export const App = () => {
  const { props, add } = useNotifications();

  return (
    <div className="app">
      <Notifications {...props} animationDuration={ANIMATION_DURATION} />
      <button
        className="add-button"
        onClick={() => {
          const types = Object.keys(Type);
          const type = types[randomInt(0, types.length - 1)] as Type;
          const title = `${type[0].toUpperCase() + type.slice(1)} Notification`;
          add({
            title,
            content: 'Some notification description',
            timeout: TIMEOUT,
            type,
          });
        }}
      >
        <MdAdd />
        Add Notification
      </button>
    </div>
  );
};
