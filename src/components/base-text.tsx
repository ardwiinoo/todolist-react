interface Props extends 
    React.HTMLAttributes<HTMLDivElement>,
    React.DOMAttributes<HTMLDivElement> {

}

export const BaseText = (props: Props) => {
    return (
        <div {...props} className={`text-dark dark:text-light text-base ${props.className}`}>{props.children}</div>
    )
}