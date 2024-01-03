<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InfoEditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'url' => $this->url,
            'content' => $this->content,
            'tag' => $this->name,
            'public' => $this->public,
            'child' => $this->child,
            'created_at' => $this->created_at->isoFormat('YYYY/M/D/(ddd) HH:mm:ss'),
            'updated_at' => $this->updated_at->isoFormat('YYYY/M/D/(ddd) HH:mm:ss'),
        ];
    }
}
