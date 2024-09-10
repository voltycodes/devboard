"use client"

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const github = formData.get('github') as string;
    const leetcode = formData.get('leetcode') as string;
    
    router.push(`/stats?github=${encodeURIComponent(github)}&leetcode=${encodeURIComponent(leetcode)}`);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter Your Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="github" className="text-sm font-medium">GitHub Username</label>
              <Input id="github" name="github" placeholder="Enter your GitHub username" />
            </div>
            <div className="space-y-2">
              <label htmlFor="leetcode" className="text-sm font-medium">LeetCode Username</label>
              <Input id="leetcode" name="leetcode" placeholder="Enter your LeetCode username" />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
