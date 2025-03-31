import { ReactNode, useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';

import { DynamicIslandTOC } from '../components/content/dynamic-island-toc/DynamicIslandTOC';
import PageLayout from '../components/layout/page-layout/PageLayout';
import SEO from '../components/layout/SEO';

const Heading = ({ children }: { children: string }) => (
  <DynamicIslandTOC.Heading>
    <h2 className="py-[6px] px-2 mt-3 -ml-2 rounded-[4px] text-gray-950 text-lg font-medium leading-5">
      {children}
    </h2>
  </DynamicIslandTOC.Heading>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-gray-950 leading-7 font-normal">{children}</p>
);

export default function DynamicIslandTOCPage() {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <PageLayout>
      <PageLayout.Title>Dynamic Island TOC</PageLayout.Title>
      <DynamicIslandTOC key={isClientSide ? 'client' : 'server'}>
        <Heading>Design System, Beyond Code</Heading>
        <Paragraph>
          The very first stage, the "pre-creation" stage, is the most important
          part of the entire process. It is crucial to set the foundation and
          direction for the decisions made during the creation and operational
          phases. If asked what to start with in a design system, I would
          answer, "Set goals, clearly define what will and will not be
          achieved."
        </Paragraph>

        <Heading>Goals</Heading>
        <Paragraph>
          A design system is created to achieve the values of consistency and
          efficiency in a product. However, the specific goals should differ
          depending on the product that needs the system. A system might
          prioritize unbreakable consistency and high productivity, or it could
          aim for greater scalability and flexibility by viewing the system as a
          tool. The philosophy and goals of the system you want to create will
          serve as the foundation for future decisions. Even when using an
          external design system, you need to define what the design system
          should be for your team.
        </Paragraph>

        <Heading>Quality is Key</Heading>
        <Paragraph>
          Once the goals and philosophy are defined, the next step is to
          establish the key principles for the system's decision-making. You
          need to clearly define what the design system will and will not do,
          how the code interface will reflect design constraints, and document
          this as specifically as possible. Philosophy, as an abstract entity,
          isn't sufficient to directly address various problems. Based on the
          goals and philosophy, you should set principles and use them to
          resolve issues while continuously refining them.
        </Paragraph>

        <Heading>Upholding the Core Principles</Heading>
        <Paragraph>
          When focusing on the trees, it's easy to overlook the forest. While
          creating the system, you'll make many decisions, but these decisions
          must align with the direction agreed upon by the team. Consider
          whether decisions, from interface naming to component-level
          consistency, maintain the desired abstraction level, and whether basic
          responsibilities like accessibility are being properly addressed.
          Decisions based on core principles require practice. At first,
          conscious effort is needed, and you might have to revisit decisions.
          However, once the team becomes practiced at decision-making, it will
          naturally make choices that don't break the principles without much
          effort. In some cases, breaking the principles might be necessary if
          the cost is justified.
        </Paragraph>

        <Heading>Setting the Core Principles</Heading>
        <Paragraph>
          Another reason code is fundamental is that you continuously face
          decision-making moments about implementation feasibility versus
          implementation value. To make good decisions, you must not be bound by
          questions of feasibility. Good decisions for a system cannot rely
          solely on one individual. Everyone, regardless of role, must have high
          design sensitivity and relentlessly pursue UX quality.
        </Paragraph>

        <Heading>Don’t Get Stuck in Implementability</Heading>
        <Paragraph>
          Usability is the ease with which a user can navigate and accomplish
          their goals using a product. Interaction design aims to improve
          usability by making products more intuitive and efficient, reducing
          the number of steps required to complete tasks and minimizing the
          amount of time users need to spend learning how to use a product.
        </Paragraph>

        <Heading>Getting Feedback Quickly</Heading>
        <Paragraph>
          When creating or redeveloping a design system, it's important to set
          clear standards for when you can tell other teams that the system is
          ready. This standard will vary from team to team, but it must not be
          delayed. No matter how much testing is done with test code within the
          team, there will always be big and small issues when applying the
          system. The later feedback is received, the later major problems will
          be discovered, making it more expensive to resolve them. It's okay to
          apply the system to a simple page or service for initial testing.
          There’s no more reliable verification than dogfooding. If contributing
          to the service is difficult, start with core components like Buttons,
          Checkboxes, and Dropdowns, and encourage feedback once these core
          components are in use.
        </Paragraph>

        <Heading>Attracting Early Adopters</Heading>
        <Paragraph>
          The first version of the system is weak. Even with good UI/UX and a
          solid interface, it’s difficult to overcome the established legacy.
          From the product team's perspective, a new system is a burden, and
          understandably, they may hesitate to adopt it. It’s important to
          empathize with this. According to Rogers’ Diffusion of Innovation
          Curve, when a product is delivered to the market, customers follow a
          distribution curve. Early adopters play a key role in promoting the
          product to the majority. It’s essential to involve these early
          adopters in product development and actively incorporate their
          feedback to stay ahead in product improvement and sales. In spreading
          the new design system, the key is how quickly and widely early
          adopters can be secured. Don't just rely on messenger announcements
          and encouragement. Actively recommend and recruit them. For example,
          when inquiries were made about legacy system components, I shared the
          improvements of the new system components and encouraged their use.
          Thankfully, a couple of people showed interest, and through offline
          meetings, I was able to highlight the advantages of the new system and
          help introduce it in small ways.
        </Paragraph>

        <Heading>Turning Early Adopters into Fans</Heading>
        <Paragraph>
          The goal of attracting early adopters is not just quick feedback but
          to turn them into fans who will actively promote the system to attract
          more users. A new system is weak and unfamiliar. In the beginning,
          there will be many inquiries. At this time, it’s crucial to help solve
          the problems from the user's perspective and impress them. Response
          speed and quality must be overwhelming. For instance, I responded to
          the first user inquiries without delay and directly tested and
          analyzed service-related problems. I even tracked down the causes of
          bugs (e.g., issues related to the Emotion library) and communicated
          the solutions in detail. When the first user successfully applied the
          new system and shared their experience with the team, developers who
          were initially hesitant began saying, "It seems worth trying."
        </Paragraph>

        <Heading>The First Step Is the Most Important and the Hardest</Heading>
        <Paragraph>
          As the first users join and the number of users grows, you’ll
          inevitably face an "operation rush." You’ll need to handle new
          component development, operations, and bug fixes simultaneously. Since
          the team size remains the same, the workload increases, and something
          will need to be deprioritized. It’s unrealistic to expect everyone to
          do everything well with the same intensity. At this point, the focus
          should be on reducing new component development. The rush of initial
          inquiries is an opportunity. This is a period when the immature system
          can grow rapidly, and gaining the trust of early adopters is crucial.
          This period is short. If you focus and organize, you can wrap up the
          rush within 1-2 weeks. Don’t lose your mental composure with the flood
          of inquiries; instead, make decisions based on the principles set at
          the beginning. If possible, keep records to ensure that
          problem-solving doesn’t rely solely on a specific team member's
          skills. Components often start with Buttons. They are highly utilized
          and form the foundation for many other components. While Buttons are a
          suitable starting point, they are not as simple as they seem. Due to
          their simple appearance, their complexity is often underestimated. If
          you're creating a brand-new design system, you can approach it with a
          "continuous improvement" mindset after completing a component set and
          applying it to a service. However, if migrating to a new system,
          you'll be dealing with "complicated components" that are deeply
          integrated into various areas. The components that form the basis of
          the system are challenging. They may appear simple, but they are far
          from easy. That’s why the first step is the most important and the
          hardest.
        </Paragraph>

        <Heading>Distinguishing What to Do and What Not to Do</Heading>
        <Paragraph>
          As the new system spreads and users increase, requests will naturally
          grow. Apart from bugs that need to be fixed, demands for convenience
          improvements or more detailed documentation will also increase. The
          system is moving beyond the early adopter phase and beginning to
          establish itself. In the "Turning Early Adopters into Fans" section,
          it was mentioned that response speed and quality must be overwhelming.
          However, at this stage, you need to change your strategy. You can’t
          respond to every request. Even small demands, if dealt with one by
          one, might cause more important tasks to fall behind. Prioritization
          is key at all times, but it becomes even more critical when the design
          system is still in the process of solidifying. You may need to pass on
          "nice-to-have" requests and solve issues with minimal cost, where
          possible. Here are a few real examples. I’ll discuss prioritization
          and criteria based on how these requests were handled.
        </Paragraph>

        <Heading>Conclusion</Heading>
        <Paragraph>
          Throughout the process of creating three different design systems,
          there were decisions I made that turned out well, and others that
          didn’t. Every time I reflect, I realize that the most important aspect
          of a design system is the decision-making process of building it up
          over time.
        </Paragraph>
      </DynamicIslandTOC>
    </PageLayout>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Dynamic Island TOC"
      description="March 2025"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/dynamic-island-toc.webp" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
