import { useState, useEffect } from "react";
import axios from "axios";
import { IPost } from "../types";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ColorRing } from 'react-loader-spinner';
import { BsFillPostcardFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading,setLoading] = useState(true);
  const token = useRecoilValue(tokenState);

  document.title ="DevHub Admin | Manage Users Posts 📃"

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/v1/admin/posts/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts", error);
      setLoading(true);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`/api/v1/admin/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPosts();
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const downloadPostsReport = async () => {
    try {
      const response = await axios.get('/api/v1/admin/downloadpostsreport', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StyleShare_Posts_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the Posts report:', error);
    }
  };

  return (
    <div>
      <div className="flex-1 flex flex-col lg:ml-80">
      <div className="mx-5 mb-5">
      <span className="flex  items-center  text-xl font-bold decoration-sky-500 decoration-dotted underline">
      <div className='inline-block p-2 text-white bg-[#000435] rounded-lg mr-2'>
      <BsFillPostcardFill size={23} />
          </div>
          All Posts
        </span>
      </div>
        {loading ? 
        <div className="flex justify-center items-center h-80">
        <ColorRing
          visible={true}
          height="100"
          width="100"
          colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)','#000435','rgb(14 165 233)']}
        />
      </div>
      :
      <>
      <div className="mx-5 lg:mr-11 overflow-x-auto shadow-md rounded-xl mb-5">
      <table className="w-full rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs md:text-sm text-white uppercase bg-sky-500 text-center">
              <tr>
                <th scope="col" className="px-8 py-3">Title</th>
                <th scope="col" className="px-8 py-3">Author</th>
                <th scope="col" className="px-3 py-3">createdAt</th>
                <th scope="col" className="px-4 py-3">Likes</th>
                <th scope="col" className="px-6 py-3">Comments</th>
                <th scope="col" className="px-16 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="text-xs md:text-sm border-b bg-[#000435] border-sky-500 hover:bg-blue-950 hover:text-white">
                  <td className="px-8 font-semibold text-white">{post.title}</td>
                  <td className="px-8 py-4 font-semibold">
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{post.author.username}</span>
                      <span className="font-thin text-gray-300">{post.author.email}</span>
                    </div>
                  </td>
                  <td className="px-3 font-semibold">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-8  font-semibold">{post.reactions.length}</td>
                  <td className="px-12  font-semibold">{post.comments.length}</td>
                  <td className="px-2 py-4 grid grid-cols-1 gap-3 justify-center md:grid-cols-2 text-center">
                  <Link to={`/admin/update-post/${post.id}`} className="font-semibold rounded-md p-2 bg-sky-500 text-white border-2 hover:bg-sky-600">
                    Update
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="font-semibold rounded-md p-2 bg-red-500 text-white border-2 hover:bg-red-600">
                    Delete
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="mx-5 overflow-x-auto rounded-xl mb-5">
          <button onClick={downloadPostsReport} className="flex items-center py-2.5 px-4 rounded-lg transition duration-200 bg-yellow-500 hover:bg-yellow-600 text-gray-100"><TbReportAnalytics size={23} className='mr-3'/>
              Download Posts Info
            </button>
          </div>
          </>
      }
      </div>
    </div>
  );
};

export default Posts;