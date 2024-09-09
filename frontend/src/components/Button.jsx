/* eslint-disable react/prop-types */

function Button({
  children,
  //   type = "button",
  bgColor = "bg-blue-600",
  textColor,
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
