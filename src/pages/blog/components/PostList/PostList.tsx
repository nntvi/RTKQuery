import { useDeletePostMutation, useGetPostsQuery } from 'pages/blog/blog.services'
import { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { startEditPost } from '../blog.slice'
import PostItem from '../PostItem'
import SkeletonPost from '../SkeletonPost'

export default function PostList() {
  const { data, isLoading, isFetching } = useGetPostsQuery()
  const [deletePost] = useDeletePostMutation()
  const dispatch = useDispatch()
  const startEdit = (id: string) => {
    dispatch(startEditPost(id))
  }

  const handleDeletePost = (id: string) => {
    deletePost(id)
  }
  // isLoading cho lan fetch dau tien
  // isFetch cho moi lan goi api
  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>RTK Query</h2>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {isFetching && (
            <Fragment>
              <SkeletonPost />
              <SkeletonPost />
            </Fragment>
          )}
          {!isFetching &&
            data?.map((post) => (
              <PostItem post={post} key={post.id} startEdit={startEdit} handleDeletePost={handleDeletePost} />
            ))}
        </div>
      </div>
    </div>
  )
}
