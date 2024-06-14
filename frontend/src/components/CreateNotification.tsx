import axios from "axios";
import { BASE_BACKEND_URL } from "../utils";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateNotification() {
  const [notifData, setNotifData] = useState<any>({
    title: "",
    body: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNotifData((state: any) => ({
      ...state,
      [name]: value,
    }));
  };

  async function createNotification(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_BACKEND_URL}/send`, {
        data: { title: notifData.title, body: notifData.body },
      });
      if (response.status === 200) {
        toast.success("Notification Success");
      }
    } catch (err: any) {
      if (err?.response?.status === 400)
        toast.error(err?.response?.data?.message || "Some error!");
    }
  }

  return (
    <form className="text-center" onSubmit={createNotification}>
      <div className="mb-5">
        <label className="block" htmlFor="title">
          Notification Title
        </label>
        <input
          onChange={handleChange}
          name="title"
          type="text"
          className="py-2 px-2 rounded-md bg-inherit border border-gray-500"
          placeholder="Notification Title"
        />
      </div>
      <div className="mb-5">
        <label className="block" htmlFor="body">
          Notification Body
        </label>
        <input
          onChange={handleChange}
          type="text"
          name="body"
          className="py-2 px-2 rounded-md bg-inherit border border-gray-500"
          placeholder="Notification Body"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm text-white backdrop-blur-3xl font-bold">
            Create Notification
          </span>
        </button>
      </div>
    </form>
  );
}
