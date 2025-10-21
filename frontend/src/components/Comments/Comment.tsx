import Avatar from '@mui/joy/Avatar';


interface UserComment {
    comment: string,
    user: string,
    date: string
}



export function Comment({ comment, user, date } : UserComment) {
  return (
    <div className="mb-4 p-4 border rounded-md bg-white border-gray-200 flex space-x-4 items-start">
      <Avatar alt={user} size="md" variant="soft" />
      <div className="flex-1">
      <div className="text-xs text-gray-600 flex items-center">
          <span className="font-semibold mr-2">{user}</span>
          <span>{date}</span>
        </div>
        <p className="text-sm mb-2">{comment}</p>
        
      </div>
    </div>
  );
}

