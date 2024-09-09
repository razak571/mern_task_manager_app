import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(8, "password atleast should be of 8 characters"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const login = async (data) => {
    console.log("data : : ", data);
  };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg  rounded-xl 
        p-10`}
      >
        <h2 className="text-2xl font-bold m-2 text-blue-600">Login</h2>
        <div className="border border-blue-600 rounded-md">
          <form onSubmit={handleSubmit(login)}>
            <div className="space-y-2 mb-0 p-4">
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
              <Button textColor="text-white" type="submit" className="w-full">
                {isLoading ? "Logging..." : "Login"}
              </Button>
            </div>
            <p className="m-1 text-center  text-black">
              Dont have an account?&nbsp;
              <Link to="/signup" className=" text-blue-600">
                Signup
              </Link>
            </p>
            <button className="bg-blue-600 mx-auto block  text-white rounded-md p-2 m-4 justify-center">
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
