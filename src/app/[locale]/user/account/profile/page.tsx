"use client";

import { InputAvatar } from "@/components/input-avatar";
import { AdvanceInput } from "@/components/ui/advance-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FormData {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImage: File | null;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    username: "bac_khoai_to",
    fullName: "Ngô Xuân Bắc",
    email: "tr**********@gmail.com",
    phoneNumber: "**********28",
    gender: "male",
    dateOfBirth: "**/*/2003",
    profileImage: null,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev: FormData) => ({
      ...prev,
      profileImage: file,
    }));
  };

  return (
    <div className="text-sm">
      <div className="border-border border-b pb-4">
        <h1 className="text-lg font-medium text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage and protect your account
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="username" className="text-sm opacity-80">
                Username
              </Label>
            </div>
            <div className="col-span-9">{formData.username}</div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="fullName" className="text-sm opacity-80">
                Name
              </Label>
            </div>
            <div className="col-span-9">
              <AdvanceInput
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="max-w-md border border-border text-sm"
                maxLength={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="email" className="text-sm opacity-80">
                Email
              </Label>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-2 max-w-md">
                <span className="text-foreground">{formData.email}</span>
                <button className="text-blue-600 hover:underline text-sm">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3"></div>
            <div className="col-span-9">
              <Button className="p-4 rounded-md">Save</Button>
            </div>
          </div>
        </div>

        <div className="border-l">
          <InputAvatar
            onChange={handleImageChange}
            maxSizeMB={1}
            allowedExtensions={[".JPEG", ".PNG"]}
          />
        </div>
      </div>
    </div>
  );
}
