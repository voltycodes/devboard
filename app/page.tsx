"use client"

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation';
import { clearString } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const github = clearString(formData.get('github') as string);
    const leetcode = clearString(formData.get('leetcode') as string);
    
    router.push(`/stats?github=${encodeURIComponent(github)}&leetcode=${encodeURIComponent(leetcode)}`);
  };

  return (
    <main className="flex justify-center items-center min-h-screen -mt-16">
      <Card className="w-[350px] mt-16">
        <CardHeader>
          <CardTitle>Enter Your Usernames To Continue</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="github" className="text-sm font-medium">GitHub Username</label>
              <Input id="github" name="github" placeholder="kujo_qtaro" />
            </div>
            <div className="space-y-2">
              <label htmlFor="leetcode" className="text-sm font-medium">LeetCode Username</label>
              <Input id="leetcode" name="leetcode" placeholder="kujo_qtaro" />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
