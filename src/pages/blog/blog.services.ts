import { CustomError } from './../../utils/helpers'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.types'
export const blogApi = createApi({
  reducerPath: 'blogApi',
  tagTypes: ['Posts'],
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/',
    prepareHeaders(headers) {
      headers.set('authorization', 'Bearer HJKLO')
      return headers
    }
  }),
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => 'posts', // method ko co argument
      providesTags(result) {
        // providesTags se chay khi getPosts chay
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Posts', id: 'LIST' }]
      }
    }),

    // mutation for PUT, PATCH, DELETE
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        try {
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      // add post thanh cong => validatesTags chay
      invalidatesTags: (result, err, body) =>
        err
          ? []
          : [
              {
                type: 'Posts',
                id: 'LIST'
              }
            ]
    }),

    getPost: build.query<Post, string>({
      query: (id) => ({ url: `posts/${id}`, headers: { hello: 'Im Vi' }, params: { first_name: 'Nguyen' } }) // method  co argument
    }),

    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      // update post thanh cong => validatesTags chay => getPost chay lai
      invalidatesTags: (result, err, data) =>
        err
          ? []
          : [
              {
                type: 'Posts',
                id: data.id
              }
            ]
    }),

    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, err, id) =>
        err
          ? []
          : [
              {
                type: 'Posts',
                id
              }
            ]
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
