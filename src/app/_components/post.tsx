/**
 * Handles the creation and management of study group posts in the Study Group Finder application.
 *
 * Features:
 * - Form for creating a new study group post.
 * - Input fields for group name, bio, subjects, location, and more.
 * - Integration with When2Meet for scheduling.
 */

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost } from "@/actions/postactions";
import { Button } from "@/components/ui/button";

const PostPage: React.FC = () => {
  const [studyGroupName, setStudyGroupName] = useState("");
  const [studyGroupBio, setStudyGroupBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]); // Array to store multiple subjects
  const [newSubject, setNewSubject] = useState(""); // Temporary input for adding a new subject
  const [when2MeetLink, setWhen2MeetLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
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
    if (newStudyDate.trim() && !studyDates.includes(newStudyDate)) {
      setStudyDates((prevDates) => [...prevDates, newStudyDate]);
      setNewStudyDate(""); // Clear the input field
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
      alert("Please enter a study group name");
      setLoading(false);
      return;
    }

    if (subjects.length === 0) {
      alert("Please add at least one subject");
      setLoading(false);
      return;
    }

    if (studyDates.length === 0) {
      alert("Please add at least one study date");
      setLoading(false);
      return;
    }

    if (!studyTime) {
      alert("Please select a study time");
      setLoading(false);
      return;
    }

    if (!location.trim()) {
      alert("Please enter a location");
      setLoading(false);
      return;
    }

    try {
      const postData = {
        studyGroupName: studyGroupName.trim(),
        studyGroupBio: studyGroupBio.trim() || null, // Optional
        subjects,
        when2MeetLink: when2MeetLink.trim() || null, // Optional
        image: image ? URL.createObjectURL(image) : null, // Optional
        studyDates,
        studyTime,
        location: location.trim(),
      };

      const response = await createPost(postData);

      if (response.success) {
        alert("Post created successfully!");
        // Reset form fields
        setStudyGroupName("");
        setStudyGroupBio("");
        setSubjects([]);
        setWhen2MeetLink("");
        setImage(null);
        setStudyDates([]);
        setStudyTime("");
        setLocation("");
      } else {
        alert(`Failed to create post: ${response.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 font-sans">
      <h1 className="text-center text-gray-800 dark:text-white text-2xl font-bold mb-6">
        Create a Study Group Post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/*Study Group Name*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyGroupName"
            className="block font-bold text-gray-700 dark:text-white"
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
            className="block font-bold text-gray-700 dark:text-white"
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
            className="block font-bold text-gray-700 dark:text-white"
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
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 rounded-md"
              >
                <span>
                  <Button
                    onClick={() => handleRemoveSubject(subject)}
                    className=" hover:text-red-700 hover:bg-red-300 bg-transparent"
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
              className="block font-bold text-gray-700 dark:text-white"
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

        {/*Image Upload*/}
        <div className="space-y-2">
          <Label
            htmlFor="picture"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Picture:
          </Label>
          <Input
            id="picture"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div> 

        {/*Study Dates*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyDates"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Study Dates: <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="studyDates"
              type="date"
              value={newStudyDate}
              onChange={(e) => setNewStudyDate(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Add a study date"
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
            {studyDates.map((date, index) => (
              <Button
                key={index}
                type="button"
                onClick={() => handleRemoveStudyDate(date)}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-red-300 hover:text-red-700 transition-colors"
              >
                {new Date(date).toLocaleDateString()}
              </Button>
            ))}
          </div>
        </div>

        {/*Study Time*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyTime"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Study Time: <span className="text-red-500">*</span>
          </Label>
          <Input
            id="studyTime"
            type="time"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        {/*Location*/}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="location"
              className="block font-bold text-gray-700 dark:text-white"
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
          type="submit"
          className="px-5 py-2.5 bg-primary text-white rounded-md text-base hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {/*Display Created Posts*/}
      {posts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Created Study Groups:
          </h2>
          {posts.map((post, index) => (
            <div key={index}>
              <p>Study Group Name: {post.studyGroupName}</p>
              <p>Study Date: {new Date(post.studyDate).toLocaleDateString()}</p>
              <p>Study Time: {new Date(post.studyTime).toLocaleTimeString()}</p>
              <p>Location: {post.location || "No location provided"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
