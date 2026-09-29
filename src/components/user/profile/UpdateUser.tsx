"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import s from "@/styles/user/profile.module.css";
import type { UserProfileData } from "@/types/user/user.types";

type Props = {
  initData: UserProfileData;
};

export default function UpdateUser({ initData }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputData, setInputData] = useState<UserProfileData>({
    username: initData.username,
    firstname: initData.firstname,
    lastname: initData.lastname,
    email: initData.email,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request = fetch("/api/user/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });
    } catch (error) {
      console.log("Error updating user", error);
    }
    setIsSubmitting(false);
  };

  return (
    <section>
      <h2>Update profile</h2>
      <form onSubmit={handleSubmit}>
        <div className={s.inputBox}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={inputData.username}
            onChange={handleChange}
          />
        </div>
        <div className={s.inputBox}>
          <label htmlFor="firstname">Firstname:</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            value={inputData.firstname}
            onChange={handleChange}
          />
        </div>
        <div className={s.inputBox}>
          <label htmlFor="lastname">Lastname:</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            value={inputData.lastname}
            onChange={handleChange}
          />
        </div>
        <div className={s.inputBox}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={inputData.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
