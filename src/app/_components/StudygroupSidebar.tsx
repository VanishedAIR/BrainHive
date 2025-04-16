import type { StudyGroup } from "./feed";
import { Button } from "@/components/ui/button";
import StudyGroupToggle from "./StudyGroupToggle";

interface StudygroupSidebarProps {
  selectedGroup: StudyGroup | null;
}

export default function StudygroupSidebar({
  selectedGroup,
}: StudygroupSidebarProps) {
  if (!selectedGroup) {
    return (
      <div className="flex-1 p-4 mx-auto my-auto text-center">
        <p className="text-gray-500">Select a study group to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6 md:space-y-8">
      <div className="flex items-center justify-center mt-2 md:mt-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center">
          {selectedGroup.studyGroupName}
        </h2>
      </div>

      {selectedGroup.studyGroupBio && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">About</h3>
          <p className="text-gray-600">{selectedGroup.studyGroupBio}</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Subjects</h3>
        <p className="text-gray-600">{selectedGroup.subjects}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Study Sessions</h3>
        <div className="text-gray-600">
          {selectedGroup.studyDates.map((date, index) => (
            <div key={index} className="mb-1">
              {new Date(date).toLocaleDateString()} at {selectedGroup.studyTime}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Created</h3>
        <p className="text-gray-600">
          {new Date(selectedGroup.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Created by</h3>
        <div className="flex items-center space-x-2">
          {selectedGroup.author.image ? (
            <img
              src={selectedGroup.author.image}
              alt={selectedGroup.author.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              {selectedGroup.author.username[0].toUpperCase()}
            </div>
          )}
          <span className="text-gray-600">
            @{selectedGroup.author.username}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Members ({selectedGroup.members.length})
        </h3>
        <div className="space-y-1">
          {selectedGroup.members.map((member) => (
            <div key={member.id} className="text-gray-600">
              @{member.username}
            </div>
          ))}
        </div>
      </div>

      {selectedGroup.when2MeetLink && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">When2Meet Link</h3>
          <Button variant="outline" asChild className="w-full">
            <a
              href={selectedGroup.when2MeetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Schedule
            </a>
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">
          {selectedGroup.location &&
          selectedGroup.location.match(/^https?:\/\//) ? (
            <a
              href={selectedGroup.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Online Meeting Link
            </a>
          ) : (
            selectedGroup.location
          )}
        </p>
      </div>
      <div className="relative bottom-[-3%] left-[50%] translate-x-[-50%] w-fit">
        <StudyGroupToggle postId={selectedGroup.id} />
      </div>
    </div>
  );
}
