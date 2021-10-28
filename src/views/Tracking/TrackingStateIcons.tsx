import {
    CheckIcon,
    CookingIcon,
    DeliveryIcon,
    OutsideIcon,
} from '../../assets/icons';

export const deliveryTrackingStates = [
    {
        text: 'Order Confirmed',
        icon: <CheckIcon />,
    },
    {
        text: 'Kitchen’s cooking',
        icon: <CookingIcon />,
    },
    {
        text: 'REEF’s on the way',
        icon: <OutsideIcon />,
    },
    {
        text: 'We’re outside',
        icon: <DeliveryIcon />,
    },
    {
        text: 'Delivered',
        icon: <CheckIcon />,
    },
];

export const pickupTrackingStates = [
    {
        text: 'Order Confirmed',
        icon: <CheckIcon />,
    },
    {
        text: 'Kitchen’s cooking',
        icon: <CookingIcon />,
    },
    {
        text: 'Your order’s almost done',
        icon: <OutsideIcon />,
    },
    {
        text: 'Pick up order',
        icon: <DeliveryIcon />,
    },
    {
        text: 'Picked up',
        icon: <CheckIcon />,
    },
];