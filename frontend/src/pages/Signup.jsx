import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import OAuth from "../components/OAuth";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const createUser = async (userData) => {
  const { data } = await axios.post(`${baseURL}/api/v1/user/signup`, userData);
  return data;
};

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
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      // Dispatch the user data to Redux store
      dispatch(setCredentials(data));
      queryClient.setQueryData(["user"], data);
      toast.success("Signup successful");
      navigate("/");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    },
  });

  const signup = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg rounded-xl p-10">
        <h2 className="text-2xl font-bold m-2 text-blue-600">Signup</h2>
        <div className="border border-blue-600 rounded-md">
          <form onSubmit={handleSubmit(signup)}>
            <div className="p-4">
              <Input placeholder="First Name" {...register("firstname")} />
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname.message}</p>
              )}
              <Input placeholder="Last Name" {...register("lastname")} />
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname.message}</p>
              )}
              <Input placeholder="Email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
              <Button
                textColor="text-white"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Signup"}
              </Button>
            </div>
            <p className="m-1 text-center text-black">
              Already have an account?&nbsp;
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </p>
            {/* <button className="bg-blue-600 mx-auto block text-white rounded-md p-2 m-4 justify-center">
              Signup with Google
            </button> */}
            <OAuth title={"Signup with Google"} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
