import React from 'react';
import { auth } from '@clerk/nextjs';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ImageForm } from './_components/image-form';
import { db } from '@/lib/db';
import { IconBadge } from '@/components/icon-badge';
import { CategoryForm } from "./_components/category-form"
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import TitleForms from './_components/title-forms';
import DescriptionForms from './_components/desctiption-forms';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: 'desc',
        }
      }
    }
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });


  if (!course) {
    return redirect('/');
  }

  const requireFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId];

  const totalFields = requireFields.length;
  const completedFields = requireFields.filter(Boolean).length;
  // const isComplete = requiredFields.every(Boolean);
  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>Course Setup</h1>
          <span className='text-sm text-slate-700'>Comple all fields {completionText}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl pl-3'>Customize your course</h2>
          </div>
          <TitleForms initialData={course} courseId={course.id} />
          <DescriptionForms initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({ label: category.name, value: category.id }))} />
        </div>

        <div className='space-y-6'>
          <div>
            <div className='flex item-center space-x-2'>
              <IconBadge icon={ListChecks} />
              <h2 className='text-xl'>Course chapters</h2>
            </div>
            {/* <ChaptersForm initialData={course} courseId={course.id} /> */}
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <IconBadge icon={CircleDollarSign} />
              <h2 className='text-xl'>Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <IconBadge icon={File} />
              <h2 className='text-xl'>Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;