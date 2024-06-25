import React from 'react'

interface PlusPatternBackgroundProps {
    plusSize?: number
    plusColor?: string
    backgroundColor?: string
    className?: string
    style?: React.CSSProperties
    fade?: boolean
    [key: string]: any
}

export const BackgroundXO: React.FC<PlusPatternBackgroundProps> = ({
    plusColor = '#fb3a5d',
    backgroundColor = 'transparent',
    plusSize = 40,
    className,
    fade = false,
    style,
    ...props
}) => {
    const encodedPlusColor = encodeURIComponent(plusColor)

    const maskStyle: React.CSSProperties = fade
        ? {
            maskImage: 'radial-gradient(circle, white 10%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(circle, white 10%, transparent 90%)',
        }
        : {}

    //  SVG taken from https://heropatterns.com/
    const backgroundStyle: React.CSSProperties = {
        backgroundColor,
        // backgroundImage: `url("data:image/svg+xml,%3Csvg width='${plusSize}' height='${plusSize}' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='${encodedPlusColor}' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        //  SVG taken from https://heropatterns.com/
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${plusSize}' height='${plusSize}' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='${encodedPlusColor}' fill-opacity='0.4'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        ...maskStyle,
        ...style,
    }

    return (
        <div
            className={`absolute inset-0 h-full w-full ${className}`}
            style={backgroundStyle}
            {...props}
        />
    )
}

export default BackgroundXO