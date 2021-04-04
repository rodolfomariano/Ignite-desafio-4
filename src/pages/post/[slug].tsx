import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const heading = post.data.content.forEach(e => e.heading);
  const body = post.data.content.forEach(e => e.body);

  const formatedDate = new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Header />
      <img src={post.data.banner.url} alt="banner" />
      <div className="content">
        <h1>{post.data.title}</h1>
        <div className="authData">
          <span>{formatedDate}</span>
          <span>{post.data.author}</span>
        </div>
        {/* <h2>{heading}</h2>
        <p>{body}</p> */}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  // console.log(posts);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug), {});

  // const post = {
  //   first_publication_date: RichText.asText(response.first_publication_date),
  //   data: {
  //     title: RichText.asText(response.data.title),
  //     banner: {
  //       url: RichText.asText(response.data.banner.url),
  //     },
  //     author: RichText.asText(response.data.author),
  //     content: {
  //       heading: RichText.asText(response.data.heading),
  //       body: {
  //         text: RichText.asText(response.data.text),
  //       },
  //     },
  //   },
  // };
  // console.log(response);
  return {
    props: {
      post,
    },
  };
};
