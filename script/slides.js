import { client } from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export async function getSlides() {
  const query = '*[_type == "project"] | order(number asc) { title, shortDescription, slug, role, mainImage, visibility }';
  try {
    const projects = await client.fetch(query);

    return projects.map((project) => ({
      slideTitle: project.title,
      slideDescription: project.shortDescription || '',
      slideUrl: `/project.html?id=${project.slug.current}`, // Or adjust based on your routing
      slideTags: project.role ? project.role.split(',').map(tag => tag.trim()) : [],
      slideImg: project.mainImage ? urlFor(project.mainImage).url() : '/work/slider-img-1.jpg',
      visibility: project.visibility,
    }));
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return []; // Return empty array on error to prevent crashes
  }
}
