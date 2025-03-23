import { DynamicIslandTOC } from '../components/content/dynamic-island-toc/DynamicIslandTOC';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function DynamicIslandTOCPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Dynamic Island TOC</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>Dynamic Island TOC</PageLayout.Summary>
        <PageLayout.DetailsContent>
          Dynamic Island TOC
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <DynamicIslandTOC>
        <DynamicIslandTOC.Heading>
          <h2>What is Interaction Design?</h2>
        </DynamicIslandTOC.Heading>
        <p className="mb-6">
          Interaction Design (IxD) is the design of interactive products and
          services in which a designer's focus goes beyond the item being
          designed to include the way users will interact with it. The goal of
          interaction design is to create products that enable the user to
          achieve their objective(s) in the best way possible.
        </p>

        <DynamicIslandTOC.Heading>
          <h2>Enhancing User Experience</h2>
        </DynamicIslandTOC.Heading>
        <p className="mb-6">
          The practice of designing interactive digital products, environments,
          systems, and services. Beyond the digital aspect, interaction design
          is also useful when creating physical products, exploring how a user
          might interact with it.
        </p>

        <DynamicIslandTOC.Heading>
          <h2>The Role of Interaction Design</h2>
        </DynamicIslandTOC.Heading>
        <p className="mb-6">
          Interaction design is a field of design that focuses on the design of
          interactive products and services. It is a multidisciplinary field
          that combines elements of design, psychology, and computer science.
        </p>

        <DynamicIslandTOC.Heading>
          <h2>Reducing Cognitive Load</h2>
        </DynamicIslandTOC.Heading>
        <p className="mb-6">
          Cognitive load refers to the mental effort required to learn and use a
          system. Good interaction design aims to reduce this load by making
          interfaces intuitive and easy to understand, allowing users to focus
          on their tasks rather than on figuring out how to use the system.
        </p>

        <DynamicIslandTOC.Heading>
          <h2>Improving Usability</h2>
        </DynamicIslandTOC.Heading>
        <p className="mb-6">
          Usability is the ease with which a user can navigate and accomplish
          their goals using a product. Interaction design aims to improve
          usability by making products more intuitive and efficient, reducing
          the number of steps required to complete tasks and minimizing the
          amount of time users need to spend learning how to use a product.
        </p>
      </DynamicIslandTOC>
    </PageLayout>
  );
}
