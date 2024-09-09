import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const signupSchema = z
  .object({
    firstname: z.string().min(1, "first name is required"),
    lastname: z.string().min(1, "last name is required"),
    email: z.string().email("invalid email address"),
    password: z.string().min(8, "password atleast should be of 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "confirm password atleast should be of 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const signup = async (data) => {
    console.log(data);
    toast.success("Signup success");
    navigate("/");
  };

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg  rounded-xl 
        p-10`}
      >
        <h2 className="text-2xl font-bold m-2 text-blue-600">Signup</h2>
        <div className="border border-blue-600 rounded-md">
          <form onSubmit={handleSubmit(signup)}>
            <div className="p-4">
              <Input placeholder="First Name" {...register("firstname")} />
              {errors.firstname && (
                <p style={{ color: "red" }}>{errors.firstname.message} </p>
              )}
              <Input placeholder="Last Name" {...register("lastname")} />
              {errors.lastname && (
                <p style={{ color: "red" }}>{errors.lastname.message} </p>
              )}
              <Input placeholder="Email" type="email" {...register("email")} />
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message} </p>
              )}
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message} </p>
              )}
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>
                  {errors.confirmPassword.message}{" "}
                </p>
              )}
              <Button
                textColor="text-white"
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Signup"}
              </Button>
            </div>
            <p className="m-1 text-center  text-black">
              Already have an account?&nbsp;
              <Link to="/login" className=" text-blue-600">
                Login
              </Link>
            </p>
            <button className="bg-blue-600 mx-auto block  text-white rounded-md p-2 m-4 justify-center">
              Signup with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
