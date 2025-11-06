"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Id } from "@workspace/backend/_generated/dataModel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ChatInterface } from "@/components/student/chat-interface";
import { TopicMaterials } from "@/components/student/topic-materials";
import { ExamInterface } from "@/components/student/exam-interface";

export default function StudentTopicDetailPage({
  params,
}: {
  params: Promise<{ subjectId: Id<"subjects">; topicId: Id<"topics"> }>;
}) {
  const { subjectId, topicId } = use(params);
  const topic = useQuery(api.topics.getById, { topicId });

  if (topic === undefined) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Tema no encontrado</p>
            <Link href={`/dashboard/student/subjects/${subjectId}`}>
              <Button variant="outline" className="mt-4">
                Volver a la Asignatura
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/dashboard/student/subjects/${subjectId}`}>
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Asignatura
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{topic.name}</h1>
        <p className="text-muted-foreground mt-2">
          {topic.description || "Sin descripción"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chatbot</TabsTrigger>
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="exams">Exámenes</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ChatInterface topicId={topicId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <TopicMaterials topicId={topicId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <ExamInterface topicId={topicId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
