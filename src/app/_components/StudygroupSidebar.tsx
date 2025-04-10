import type { StudyGroup } from "./feed";

interface StudygroupSidebarProps {
  selectedGroup: StudyGroup | null;
}

export default function StudygroupSidebar({ selectedGroup }: StudygroupSidebarProps) {
  if (!selectedGroup) {
    return (
      <div className="flex-1 p-4">
        <p className="text-gray-500">Select a study group to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4">
      <h2 className="text-2xl font-bold text-primary">{selectedGroup.studyGroupName}</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Subjects</h3>
        <p className="text-gray-600">{selectedGroup.subjects}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Study Date</h3>
        <p className="text-gray-600">
          {new Date(selectedGroup.studyDate).toLocaleDateString()}
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
          <span className="text-gray-600">@{selectedGroup.author.username}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Members ({selectedGroup.members.length})</h3>
        <div className="space-y-1">
          {selectedGroup.members.map(member => (
            <div key={member.id} className="text-gray-600">
              @{member.username}
            </div>
          ))}
        </div>
      </div>

      {selectedGroup.when2MeetLink && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">When2Meet Link</h3>
          <a 
            href={selectedGroup.when2MeetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover underline"
          >
            Open Schedule
          </a>
        </div>
      )}
    </div>
  );
}