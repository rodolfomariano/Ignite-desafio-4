import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const { results, next_page } = postsPagination;

  return (
    <>
      <div className={styles.container}>
        <Header />
        {results.map(post => (
          <Link href={`/post/${post.uid}`}>
            <div key={post.uid} className={styles.postContainer}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div className={styles.dateAuthor}>
                <div className={styles.datePublication}>
                  <FiCalendar color="#FF57B2" />
                  <span>{post.first_publication_date}</span>
                </div>
                <div className={styles.author}>
                  <FiUser color="#FF57B2" />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {!next_page === null ? <h4> Carregar mais{next_page}</h4> : ''}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    const formatedDate = format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    );
    return {
      uid: post.uid,
      first_publication_date: formatedDate,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page,
      },
    },
    revalidate: 60 * 60 * 24,
  };
};
