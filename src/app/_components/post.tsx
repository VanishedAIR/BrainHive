"use client";

/**
 * PostPage Component
 *
 * This component allows users to create a new study group post. It includes a form for entering study group details such as name, bio, subjects, dates, time, and location.
 *
 * Props:
 * - `redirectPath` (string, optional): The path to redirect the user after successfully creating a study group.
 *
 * State:
 * - `studyGroupName` (string): The name of the study group.
 * - `studyGroupBio` (string): A brief description of the study group.
 * - `subjects` (string[]): An array of subjects associated with the study group.
 * - `newSubject` (string): Temporary input for adding a new subject.
 * - `when2MeetLink` (string): A link to a When2Meet scheduling page (optional).
 * - `studyDates` (string[]): An array of selected study dates.
 * - `newStudyDate` (string): Temporary input for adding a new study date.
 * - `studyTime` (string): The selected study time.
 * - `location` (string): The location of the study group.
 * - `loading` (boolean): Indicates whether the form submission is in progress.
 * - `posts` (any[]): Local state to store posts (not currently used).
 *
 * Functions:
 * - `handleAddSubject`: Adds a new subject to the `subjects` array.
 * - `handleRemoveSubject`: Removes a subject from the `subjects` array.
 * - `handleAddStudyDate`: Adds a new date to the `studyDates` array.
 * - `handleRemoveStudyDate`: Removes a date from the `studyDates` array.
 * - `handleSubmit`: Validates the form, submits the study group data, and handles success or error responses.
 *
 * Components:
 * - `Input`: A reusable input field component.
 * - `Label`: A reusable label component for form fields.
 * - `Button`: A styled button component for actions like adding subjects, dates, or submitting the form.
 *
 * External Actions:
 * - `createPost`: Sends the study group data to the server to create a new post.
 * - `toast`: Displays success or error notifications to the user.
 * - `router.push`: Redirects the user to the specified path after successful form submission.
 *
 * Styling:
 * - Uses Tailwind CSS for responsive design and consistent styling.
 * - Includes hover effects, transitions, and accessibility features.
 *
 * Accessibility:
 * - Includes `aria-labels` and `alt` attributes for screen readers.
 * - Provides tooltips for additional context on certain fields (e.g., When2Meet link, location).
 *
 * Behavior:
 * - Validates required fields before submission.
 * - Displays error messages for missing or invalid inputs.
 * - Resets the form fields after successful submission.
 * - Redirects the user to the specified path if `redirectPath` is provided.
 */

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost } from "@/actions/postactions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface PostProps {
  redirectPath?: string;
}

const PostPage: React.FC<PostProps> = ({ redirectPath }) => {
  const router = useRouter();
  const [studyGroupName, setStudyGroupName] = useState("");
  const [studyGroupBio, setStudyGroupBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]); // Array to store multiple subjects
  const [newSubject, setNewSubject] = useState(""); // Temporary input for adding a new subject
  const [when2MeetLink, setWhen2MeetLink] = useState("");
  const [studyDates, setStudyDates] = useState<string[]>([]); // Array to store multiple study dates
  const [studyTime, setStudyTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Local state to store posts
  const [newStudyDate, setNewStudyDate] = useState(""); // Temporary input for adding a new study date

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject)) {
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
      setNewSubject(""); // Clear the input field
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject !== subjectToRemove)
    );
  };

  const handleAddStudyDate = () => {
    if (newStudyDate.trim()) {
      if (!studyDates.includes(newStudyDate)) {
        setStudyDates((prevDates) => [...prevDates, newStudyDate]);
        setNewStudyDate(""); 
      } else {
        toast({
          title: "Duplicate Date",
          description: "This date has already been added",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveStudyDate = (dateToRemove: string) => {
    setStudyDates((prevDates) =>
      prevDates.filter((date) => date !== dateToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!studyGroupName.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter a study group name",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (subjects.length === 0) {
      toast({
        title: "Required Field",
        description: "Please add at least one subject",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (studyDates.length === 0) {
      toast({
        title: "Required Field",
        description: "Please add at least one study date",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!studyTime) {
      toast({
        title: "Required Field",
        description: "Please select a study time",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!location.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter a location",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (when2MeetLink.trim()) {
      if (!when2MeetLink.startsWith("https://") || !when2MeetLink.includes("when2meet")) {
        toast({
          title: "Invalid When2Meet Link",
          description: "Please enter a secure When2Meet link (must start with https:// and include when2meet)",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    try {
      const postData = {
        studyGroupName: studyGroupName.trim(),
        studyGroupBio: studyGroupBio.trim() || null, // Optional
        subjects,
        when2MeetLink: when2MeetLink.trim() || null, // Optional
        studyDates,
        studyTime,
        location: location.trim(),
      };

      const response = await createPost(postData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Study group created successfully",
        });
        // Reset form fields
        setStudyGroupName("");
        setStudyGroupBio("");
        setSubjects([]);
        setWhen2MeetLink("");
        setStudyDates([]);
        setStudyTime("");
        setLocation("");

        if (redirectPath) {
          router.push(redirectPath);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create study group",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 font-sans">
      <div className="border border-gray-300 rounded-lg p-5">
        <h1 className="text-center text-gray-800 text-primary text-3xl font-bold mb-6">
          Create a Study Group Post
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/*Study Group Name*/}
          <div className="space-y-2">
            <Label
              htmlFor="studyGroupName"
              className="block font-bold text-lg text-gray-700 text-primary"
            >
              Name of Study Group: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studyGroupName"
              type="text"
              value={studyGroupName}
              onChange={(e) => setStudyGroupName(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter the name of the study group"
              required
            />
          </div>

          {/*Study Group Bio*/}
          <div className="space-y-2">
            <Label
              htmlFor="studyGroupBio"
              className="block font-bold text-lg text-gray-700 text-primary"
            >
              Study Group Bio:
            </Label>
            <Input
              id="studyGroupBio"
              type="text"
              value={studyGroupBio}
              onChange={(e) => setStudyGroupBio(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter a brief bio about the study group (optional)"
            />
          </div>

          {/*Subjects*/}
          <div className="space-y-2">
            <Label
              htmlFor="subjects"
              className="block font-bold text-lg text-gray-700 text-primary"
            >
              Subjects: <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="subjects"
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Add a subject"
              />
              <Button
                type="button"
                onClick={handleAddSubject}
                className="h-12 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-200 rounded-md"
                >
                  <span>
                    <Button
                      onClick={() => handleRemoveSubject(subject)}
                      className=" hover:text-red-700 hover:bg-red-300 text-gray-700 bg-transparent"
                    >
                      {subject}
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/*When2Meet Link*/}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="when2MeetLink"
                className="block font-bold text-lg text-gray-700 text-primary"
              >
                When2Meet Link:
              </Label>
              <div className="relative group">
                <span className="cursor-help text-gray-500">ⓘ</span>
                <div className="absolute hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg -top-2 left-6">
                  If you can't decide on a time, you can use <a href = "https://www.when2meet.com/">When2Meet.com</a> as a polling platform to find a time that works for everyone in your study group. Meanwhile pick a date and time to get started!
                </div>
              </div>
            </div>
            <Input
              id="when2MeetLink"
              type="url"
              value={when2MeetLink}
              onChange={(e) => setWhen2MeetLink(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter the When2Meet link (optional)"
            />
          </div>

          {/*Study Dates*/}
          <div className="space-y-2">
            <Label
              htmlFor="studyDates"
              className="block font-bold text-lg text-gray-700 text-primary"
            >
              Study Dates: <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="studyDates"
                type="date"
                value={newStudyDate}
                onChange={(e) => setNewStudyDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} 
                className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary text-gray-400 appearance-none"
              />
              <Button
                type="button"
                onClick={handleAddStudyDate}
                className="h-12 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {studyDates.map((date, index) => {
                const [year, month, day] = date.split('-').map(Number);
                const displayDate = new Date(year, month - 1, day); 
                
                return (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleRemoveStudyDate(date)}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-red-300 hover:text-red-700 transition-colors"
                  >
                    {displayDate.toLocaleDateString()}
                  </Button>
                );
              })}
            </div>
          </div>

          {/*Study Time*/}
          <div className="space-y-2">
            <Label
              htmlFor="studyTime"
              className="block font-bold text-lg text-gray-700 text-primary"
            >
              Study Time: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studyTime"
              type="time"
              value={studyTime}
              onChange={(e) => setStudyTime(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary text-gray-400 appearance-none "
              required
            />
          </div>

          {/*Location*/}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="location"
                className="block font-bold text-lg text-gray-700 text-primary"
              >
                Location: <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <span className="cursor-help text-gray-500">ⓘ</span>
                <div className="absolute hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg -top-2 left-6">
                  Is this an in-person or online study group? If it's online, you can add your meeting link, or if it's in-person, you can add the in-person location here.
                </div>
              </div>
            </div>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Where will the study group be held?"
            />
          </div>

          {/*Submit Button*/}
          <Button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-primary text-white rounded-md text-base hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
